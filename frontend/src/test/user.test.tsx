import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import {LoginForm} from '../components/LoginForm'
import { UserContext } from '../contexts/globalContexts.tsx'
import { userLogin } from '../api/userAPI.ts'
import { MemoryRouter } from 'react-router-dom'
import {RegisterPage} from "../pages/ReigisterPage.tsx";
vi.mock('../api/userAPI.ts')
vi.mock('../api/upload.ts', () => ({
    uploadImageToServer: vi.fn()
}))
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: vi.fn(),
    }
})
//
describe('User相关组件', () => {
    const mockSetCurrentUser = vi.fn()
    const mockSetIsLoggedIn = vi.fn()
    const mockUserContext = {
        currentUser: null,
        setCurrentUser: mockSetCurrentUser,
        isLoggedIn: false,
        setIsLoggedIn: mockSetIsLoggedIn,
        favourList:[],
        setFavourList: vi.fn(),
        websocket:null,
        setWebSocket: vi.fn()
    }

    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()
    })

    const renderLoginForm = () => {
        return render(
            <MemoryRouter>
                <UserContext.Provider value={mockUserContext}>
                    <LoginForm />
                </UserContext.Provider>
            </MemoryRouter>
        )
    }

    it('应该正确渲染表单元素', () => {
        renderLoginForm()

        expect(screen.getByLabelText('手机号')).toBeInTheDocument()
        expect(screen.getByLabelText('密码')).toBeInTheDocument()
        expect(screen.getByText('立即登录')).toBeInTheDocument()
        expect(screen.getByText('前往注册')).toBeInTheDocument()
    })

    it('应该更新输入字段的值', () => {
        renderLoginForm()

        const phoneInput = screen.getByLabelText('手机号') as HTMLInputElement
        const passwordInput = screen.getByLabelText('密码') as HTMLInputElement

        fireEvent.change(phoneInput, { target: { value: '13800138000', name: 'phone' } })
        fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } })

        expect(phoneInput.value).toBe('13800138000')
        expect(passwordInput.value).toBe('password123')
    })

    it('成功登录后应该调用API并更新状态', async () => {
        const mockResponse = {
                token: 'fake-token',
                userVO: { id: 1, name: 'Test User', phone: '13800138000' }
            }
        ;

        (userLogin as jest.Mock).mockResolvedValue(mockResponse)

        renderLoginForm()

        fireEvent.change(screen.getByLabelText('手机号'), {
            target: { value: '13800138000', name: 'phone' }
        })
        fireEvent.change(screen.getByLabelText('密码'), {
            target: { value: 'password123', name: 'password' }
        })
        const form = screen.getByTestId('login-form')
        fireEvent.submit(form)

        await waitFor(() => {
            expect(userLogin).toHaveBeenCalledWith({
                phone: '13800138000',
                password: 'password123'
            })
            expect(sessionStorage.getItem('authToken')).toBe('fake-token')
            expect(mockSetCurrentUser).toHaveBeenCalledWith(mockResponse.userVO)
            expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true)
        })
    })
    it('应该显示验证错误当表单未正确填写', async () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        )

        // 提交空表单
        const form = screen.getByTestId('register-form')
        fireEvent.submit(form)
        // 检查验证错误
        expect(await screen.findByText('用户名不能为空')).toBeInTheDocument()
        expect(await screen.findByText('手机号不能为空')).toBeInTheDocument()
        expect(await screen.findByText('密码长度至少为6位')).toBeInTheDocument()
    })

})
