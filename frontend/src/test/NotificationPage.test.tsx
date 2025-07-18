import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {NotificationPage} from '../pages/Notification'; // 根据实际路径调整
import { getNotice } from '../api/userAPI';
import { NotificationContext } from '../contexts/globalContexts';
import type {Notice} from "../types.ts";

// 类型定义

// 模拟模块
vi.mock('../api/userAPI', () => ({
    getNotice: vi.fn(),
}));

// 为 useNavigate 创建类型化的模拟
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal() as typeof import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// 模拟通知数据
const mockNotices: Notice[] = [
    {
        id: 1,
        text: '场地更新通知',
        content: '场地A已更新开放时间',
        createTime: '2023-10-01T10:00:00Z',
        read: false,
        venueId: 101,
        venueName: '场地A'
    },
    {
        id: 2,
        text: '新评论通知',
        content: '用户B评论了你的场地',
        createTime: '2023-10-02T14:30:00Z',
        read: true,
        venueId: 102,
        venueName: '场地B'
    }
];

describe('NotificationPage', () => {
    const mockSetIsNewNotice = vi.fn();
    const mockContextValue = {
        isNewNotice: true,
        setIsNewNotice: mockSetIsNewNotice
    };

    beforeEach(() => {
        sessionStorage.setItem('authToken', 'test-token');
        mockNavigate.mockClear();
        mockSetIsNewNotice.mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
    });

    // 渲染包装组件
    const renderComponent = () => {
        return render(
            <NotificationContext.Provider value={mockContextValue}>
                <MemoryRouter>
                    <NotificationPage />
                </MemoryRouter>
            </NotificationContext.Provider>
        );
    };

    it('显示加载状态', () => {
        vi.mocked(getNotice).mockImplementation(() =>
            new Promise<Notice[]>(() => {})
        );

        renderComponent();

        expect(screen.getByText('加载通知中...')).toBeInTheDocument();
    });

    it('处理未登录状态', async () => {
        sessionStorage.removeItem('authToken');

        renderComponent();

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/home');
        });
    });

    it('显示API错误信息', async () => {
        vi.mocked(getNotice).mockRejectedValue(new Error('API错误'));

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('API错误')).toBeInTheDocument();
            expect(screen.getByText('重新加载')).toBeInTheDocument();
        });
    });

    it('成功渲染通知列表', async () => {
        vi.mocked(getNotice).mockResolvedValue(mockNotices);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('通知中心')).toBeInTheDocument();
            expect(screen.getByText('1 条未读')).toBeInTheDocument();
            expect(screen.getByText('场地更新通知')).toBeInTheDocument();
        });
    });

    // ...其他测试用例保持类似结构...
});
