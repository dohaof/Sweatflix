import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {ScheduleCreate} from '../pages/ScheduleCreate'; // 根据实际路径调整
import { getVenueById } from '../api/venueAPI';
import { createSchedule } from '../api/scheduleAPI';
import type {Venue, VenueScheduleCreation} from "../types.ts";

// 类型定义

window.alert = () => {};  // provide an empty implementation for window.alert
// 模拟模块
vi.mock('../api/venueAPI', () => ({
    getVenueById: vi.fn(),
}));

vi.mock('../api/scheduleAPI', () => ({
    createSchedule: vi.fn(),
}));

// 为路由钩子创建类型化模拟
const mockNavigate = vi.fn();
const mockUseParams = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as typeof import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => mockUseParams(),
    };
});

// 模拟数据
const mockVenue: Venue = {
    id: 1,
    name: '测试场馆',
    description: '这是一个测试场馆',
    image: 'venue-image.jpg',
    scheduleId:[]
};

const mockFormData: VenueScheduleCreation = {
    venueId: 1,
    startTime: '2023-10-01T10:00',
    endTime: '2023-10-01T12:00',
    capacity: 10,
    price: 100
};

describe('ScheduleCreate', () => {
    beforeEach(() => {
        // 设置初始参数
        mockUseParams.mockReturnValue({ venue_id: '1' });
        // 设置 sessionStorage
        sessionStorage.setItem('authToken', 'test-token');
        // 重置模拟函数
        mockNavigate.mockReset();
        vi.mocked(getVenueById).mockReset();
        vi.mocked(createSchedule).mockReset();
    });

    afterEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
    });

    // 渲染组件
    const renderComponent = () => {
        return render(
            <MemoryRouter>
                <ScheduleCreate />
            </MemoryRouter>
        );
    };


    it('处理场馆加载错误', async () => {
        vi.mocked(getVenueById).mockRejectedValue(new Error('加载失败'));

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('加载失败')).toBeInTheDocument();
        });
    });


    it('表单输入和验证', async () => {
        vi.mocked(getVenueById).mockResolvedValue(mockVenue);
        renderComponent();

        await screen.findByText('创建预约时段');

        // 获取表单元素
        const startInput = screen.getByLabelText('开始时间') as HTMLInputElement;
        const endInput = screen.getByLabelText('结束时间') as HTMLInputElement;
        const submitButton = screen.getByText('创建预约时段');

        // 测试时间顺序
        fireEvent.change(startInput, { target: { value: '2023-10-01T12:00' } });
        fireEvent.change(endInput, { target: { value: '2023-10-01T10:00' } });
        fireEvent.click(submitButton);
        expect(await screen.findByText('结束时间必须晚于开始时间')).toBeInTheDocument();

    });

    it('表单输入和验证2', async () => {
        vi.mocked(getVenueById).mockResolvedValue(mockVenue);
        renderComponent();

        await screen.findByText('创建预约时段');

        // 获取表单元素
        const startInput = screen.getByLabelText('开始时间') as HTMLInputElement;
        const endInput = screen.getByLabelText('结束时间') as HTMLInputElement;
        const priceInput = screen.getByLabelText('价格 (¥)') as HTMLInputElement;
        // 测试有效输入
        fireEvent.change(startInput, { target: { value: '2023-10-01T10:00' } });
        fireEvent.change(endInput, { target: { value: '2023-10-01T12:00' } });
        fireEvent.change(priceInput, { target: { value: '100' } });

        // 验证预览更新
        expect(screen.getByText('2023/10/01 10:00')).toBeInTheDocument();
        expect(screen.getByText('2023/10/01 12:00')).toBeInTheDocument();
        expect(screen.getByText('10 人')).toBeInTheDocument();
        expect(screen.getByText('¥100.00/人')).toBeInTheDocument();
    });

    it('容量加减按钮功能', async () => {
        vi.mocked(getVenueById).mockResolvedValue(mockVenue);
        renderComponent();

        await screen.findByText('创建预约时段');

        const minusButton = screen.getByText('-');
        const plusButton = screen.getByText('+');
        const capacityInput = screen.getByLabelText('最大容量') as HTMLInputElement;

        // 初始值
        expect(capacityInput.value).toBe('10');

        // 测试增加
        fireEvent.click(plusButton);
        expect(capacityInput.value).toBe('11');

        // 测试减少
        fireEvent.click(minusButton);
        fireEvent.click(minusButton);
        expect(capacityInput.value).toBe('9');

        // 测试最小值限制
        for (let i = 0; i < 10; i++) {
            fireEvent.click(minusButton);
        }
        expect(capacityInput.value).toBe('1');
    });

    it('成功提交表单', async () => {
        vi.mocked(getVenueById).mockResolvedValue(mockVenue);
        vi.mocked(createSchedule).mockResolvedValue('创建成功');

        renderComponent();

        await screen.findByText('创建预约时段');

        // 填充表单
        fireEvent.change(screen.getByLabelText('开始时间'), {
            target: { value: mockFormData.startTime }
        });
        fireEvent.change(screen.getByLabelText('结束时间'), {
            target: { value: mockFormData.endTime }
        });

        // 提交表单
        fireEvent.click(screen.getByText('创建预约时段'));

        // 验证提交状态
        expect(screen.getByText('创建中...')).toBeInTheDocument();

        await waitFor(() => {
            // 验证API调用
            expect(vi.mocked(createSchedule)).toHaveBeenCalledWith({
                venueId: 1,
                startTime: '2023-10-01T10:00',
                endTime: '2023-10-01T12:00',
                capacity: 10,
                price: 100
            }, 'test-token');

            // 验证导航
            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });
    });

    it('处理表单提交错误', async () => {
        vi.mocked(getVenueById).mockResolvedValue(mockVenue);
        vi.mocked(createSchedule).mockRejectedValue(new Error('创建失败'));

        renderComponent();

        await screen.findByText('创建预约时段');

        // 填充并提交表单
        fireEvent.change(screen.getByLabelText('开始时间'), {
            target: { value: mockFormData.startTime }
        });
        fireEvent.change(screen.getByLabelText('结束时间'), {
            target: { value: mockFormData.endTime }
        });
        fireEvent.click(screen.getByText('创建预约时段'));

        // 验证错误显示
        await waitFor(() => {
            expect(screen.getByText('创建失败')).toBeInTheDocument();
        });
    });

    it('返回按钮功能', async () => {
        vi.mocked(getVenueById).mockResolvedValue(mockVenue);

        renderComponent();

        await screen.findByText('返回场馆');

        fireEvent.click(screen.getByText('返回场馆'));

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('处理无效场馆ID', async () => {
        mockUseParams.mockReturnValue({ venue_id: undefined });

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('场馆ID无效')).toBeInTheDocument();
        });
    });

    it('格式化时间显示', async () => {
        vi.mocked(getVenueById).mockResolvedValue(mockVenue);

        renderComponent();

        await screen.findByText('创建预约时段');

        // 设置时间
        fireEvent.change(screen.getByLabelText('开始时间'), {
            target: { value: '2023-12-31T23:59' }
        });

        // 验证格式化显示
        expect(screen.getByText('2023/12/31 23:59')).toBeInTheDocument();
    });
});
