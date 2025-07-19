
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {MemoryRouter, Routes, Route, useNavigate} from 'react-router-dom'
import {VenueDetail} from '../pages/VenueDetail' // 请替换为实际路径
import { UserContext } from '../contexts/globalContexts.tsx'
import type {Venue, VenueSchedule, Comment, Role} from '../types'
const { mockVenueAPI, mockScheduleAPI, mockCommentAPI, mockUploadAPI } = vi.hoisted(() => {
    return {
        mockVenueAPI: {
            getVenueById: vi.fn(),
            deleteVenue: vi.fn(),
            favourVenue: vi.fn(),
        }, mockScheduleAPI: {
            getSchedulesOfVenue: vi.fn(),
            deleteSchedule: vi.fn(),
            bookSchedule: vi.fn(),
            notifyPay: vi.fn(),
        }, mockCommentAPI: {
            getCommentsByVenueId: vi.fn(),
            addComment: vi.fn(),
            thumbUpComment: vi.fn(),
        }, mockUploadAPI: {
            uploadImageToServer: vi.fn(),
        }

    }})

window.alert = () => {};
window.confirm = vi.fn(() => true)
vi.mock('react-router-dom', async (importOriginal) => {
    const mod = await importOriginal<typeof import('react-router-dom')>()
    return {
        ...mod,
        useNavigate: vi.fn(), // 初始模拟
    }
})
vi.mock('../api/venueAPI.ts', () => mockVenueAPI)
vi.mock('../api/scheduleAPI.ts', () => mockScheduleAPI)
vi.mock('../api/commentAPI.ts', () => mockCommentAPI)
vi.mock('../api/upload.ts', () => mockUploadAPI)

describe('VenueDetail 组件测试', () => {
    const mockVenue: Venue = {
        id: 1,
        name: '测试场馆',
        description: '这是一个测试场馆描述',
        image: 'test-image.jpg',
        schedulesId:[]
    }

    const mockSchedule: VenueSchedule = {
        id: 101,
        venueId: 1,
        startTime: '2023-12-31T10:00:00Z',
        endTime: '2023-12-31T12:00:00Z',
        capacity: 50,
        price: 100,
        scheduleOrders: [],
        bookedForCurrentUser: false,
    }

    const mockComment: Comment = {
        id: 201,
        venueId: 1,
        userId: 2,
        userName: '评论用户',
        userAvatar: 'avatar.jpg',
        content: '测试评论内容',
        rate: 5,
        thumbUpCount: 10,
        hasThumbed: false,
        createdAt: '2023-01-02T00:00:00Z',
        images: ['comment-image.jpg'],
    }

    const adminUser = {
        id: 1,
        username: 'admin',
        role: 'admin' as Role,
        image: 'admin-avatar.jpg',
        phone: "phone",
    }

    const normalUser = {
        id: 2,
        username: 'user',
        role: 'norm' as Role,
        image: 'user-avatar.jpg',
        phone: 'phone',
    }

    const renderComponent = (user = normalUser, venueId = '1',isLogin=true) => {
        return render(
            <UserContext.Provider
                value={{
                    currentUser: user,
                    favourList: [1, 2, 3],
                    setCurrentUser: vi.fn(),
                    setFavourList: vi.fn(),
                    setWebSocket:vi.fn(),
                    setIsLoggedIn:vi.fn(),
                    isLoggedIn:isLogin,
                    websocket:null
                }}
            >
                <MemoryRouter initialEntries={[`/venue/${venueId}`]}>
                    <Routes>
                        <Route path="/venue/:venue_id" element={<VenueDetail />} />
                    </Routes>
                </MemoryRouter>
            </UserContext.Provider>
        )
    }

    beforeEach(() => {
        // 设置sessionStorage
        sessionStorage.setItem('authToken', 'test-token')

        // 重置所有mock
        vi.resetAllMocks()

        // 设置默认mock实现
        mockVenueAPI.getVenueById.mockResolvedValue(mockVenue)
        mockVenueAPI.deleteVenue.mockResolvedValue('删除成功')
        mockVenueAPI.favourVenue.mockResolvedValue('收藏操作成功')

        mockScheduleAPI.getSchedulesOfVenue.mockResolvedValue([mockSchedule])
        mockScheduleAPI.deleteSchedule.mockResolvedValue('排期删除成功')
        mockScheduleAPI.bookSchedule.mockResolvedValue({ orderId: 'order-123', info: '预定成功' })
        mockScheduleAPI.notifyPay.mockResolvedValue('支付状态更新成功')

        mockCommentAPI.getCommentsByVenueId.mockResolvedValue([mockComment])
        mockCommentAPI.addComment.mockResolvedValue('评论添加成功')
        mockCommentAPI.thumbUpComment.mockResolvedValue('点赞成功')

        mockUploadAPI.uploadImageToServer.mockResolvedValue('uploaded-image.jpg')
    })

    afterEach(() => {
        sessionStorage.clear()
    })

    it('渲染加载状态', async () => {
        // 模拟长时间加载
        mockVenueAPI.getVenueById.mockImplementation(() => new Promise(() => {}))

        renderComponent()

        // 查找具有特定类名的加载指示器
        const spinner = document.querySelector('.loading-spinner'); // 备选方案

        expect(spinner).toBeInTheDocument()
    })

    it('正常渲染场馆信息', async () => {
        renderComponent()

        await waitFor(() => {
            expect(screen.getByText('测试场馆')).toBeInTheDocument()
            expect(screen.getByText('这是一个测试场馆描述')).toBeInTheDocument()
            expect(screen.getByText('1个')).toBeInTheDocument()
            expect(screen.getByText('¥100.00')).toBeInTheDocument()
        })
    })

    it('管理员用户显示管理按钮', async () => {
        renderComponent(adminUser)

        await waitFor(() => {
            expect(screen.getByText('删除场馆')).toBeInTheDocument()
            expect(screen.getByText('添加预约')).toBeInTheDocument()
            expect(screen.getByText('修改场馆')).toBeInTheDocument()
        })
    })

    it('普通用户显示收藏按钮', async () => {
        renderComponent()

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /收藏/ })).toBeInTheDocument()
        })
    })

    it('删除场馆功能（管理员）', async () => {
        const user = userEvent.setup()
        renderComponent(adminUser)
        const navigateMock = vi.fn()
        vi.mocked(useNavigate).mockImplementation(() => navigateMock)
        await waitFor(() => {
            expect(screen.getByText('删除场馆')).toBeInTheDocument()
        })

        const deleteButton = screen.getByText('删除场馆')
        await user.click(deleteButton)

        // 验证API调用
        expect(mockVenueAPI.deleteVenue).toHaveBeenCalledWith(1, 'test-token')
        expect(navigateMock).toHaveBeenCalledWith('/home')
    })
    it('发表评论功能', async () => {
        const user = userEvent.setup()
        renderComponent()

        // 切换到发表评论选项卡 - 使用 act 包裹
        fireEvent.click(await screen.findByText('发表评论'))

        // 设置评分
        const starInputs = await screen.findAllByRole('radio')
        await user.click(starInputs[3]) // 选择第4颗星

        // 填写评论内容
        const textarea = screen.getByPlaceholderText('分享您的体验...')
        await user.type(textarea, '这是一个测试评论')


        // 模拟图片上传
        const file = new File(['test'], 'test.png', { type: 'image/png' })
        const fileInput = screen.getByRole('imgbar')
        await user.upload(fileInput, file)


        // 等待图片上传完成
        await waitFor(() => {
            expect(mockUploadAPI.uploadImageToServer).toHaveBeenCalled()
        })

        // 提交评论
        const submitButton = screen.getByText('提交评论')
        await user.click(submitButton)

        // 验证API调用 - 使用 waitFor 确保状态更新完成
        await waitFor(() => {
            expect(mockCommentAPI.addComment).toHaveBeenCalledWith(
                {
                    venueId: 1,
                    content: '这是一个测试评论',
                    rate: 4,
                    images: ['uploaded-image.jpg'],
                },
                'test-token'
            )
        })
    })

    it('点赞评论功能', async () => {
        const user = userEvent.setup()
        renderComponent()

        // 切换到评论选项卡 - 使用 act 包裹

        fireEvent.click(await screen.findByText('用户评论'))


        // 等待评论加载完成
        await waitFor(() => {
            expect(screen.getByText('测试评论内容')).toBeInTheDocument()
        })

        // 查找点赞按钮
        const thumbButton = screen.getByRole('button', {
            name: /点赞/,
        })

        // 点击点赞按钮 - 使用 act 包裹
        await user.click(thumbButton)


        // 验证API调用 - 使用 waitFor 确保状态更新完成
        await waitFor(() => {
            expect(mockCommentAPI.thumbUpComment).toHaveBeenCalledWith(201, 'test-token')
        })
    })

    it('处理错误状态', async () => {
        // 模拟API错误
        mockVenueAPI.getVenueById.mockRejectedValue(new Error('加载失败'))

        renderComponent()

        await waitFor(() => {
            expect(screen.getByText('加载失败')).toBeInTheDocument()
        })
    })

    it('未登录用户跳转', async () => {
        const navigateMock = vi.fn()

        // 使用 vi.mocked 来设置具体实现
        vi.mocked(useNavigate).mockImplementation(() => navigateMock)

        // 模拟未登录状态
        const user = {
            ...normalUser,
            id: 0, // 未登录
        }
        renderComponent(user,"1",false)

        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledWith('/home')
        })
    })
})
