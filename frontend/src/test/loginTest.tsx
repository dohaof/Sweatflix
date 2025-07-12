// import { describe, it, expect, vi, beforeEach } from 'vitest'
// import { render, screen, fireEvent, waitFor } from '@testing-library/react'
// import {LoginForm} from '../components/LoginForm'
// import { UserContext } from '../contexts/globalContexts.tsx'
// import { userLogin } from '../api/userAPI.ts'
// import { MemoryRouter } from 'react-router-dom'
//
// // 模拟API和上下文
// vi.mock('../api/userAPI.ts')
// vi.mock('react-router-dom', async () => {
//     const actual = await vi.importActual('react-router-dom')
//     return {
//         ...actual,
//         useNavigate: vi.fn(),
//     }
// })
//
// describe('LoginForm 组件', () => {
//     const mockSetCurrentUser = vi.fn()
//     const mockSetIsLoggedIn = vi.fn()
//     const mockNavigate = vi.fn()
//     const mockUserContext = {
//         currentUser: null,
//         setCurrentUser: mockSetCurrentUser,
//         isLoggedIn: false,
//         setIsLoggedIn: mockSetIsLoggedIn,
//     }
//
//     beforeEach(() => {
//         vi.clearAllMocks()
//         localStorage.clear()
//     })
//
//     const renderLoginForm = () => {
//         return render(
//             <MemoryRouter>
//                 <UserContext.Provider value={mockUserContext}>
//                     <LoginForm />
//                 </UserContext.Provider>
//             </MemoryRouter>
//         )
//     }
//
//     it('应该正确渲染表单元素', () => {
//         renderLoginForm()
//
//         expect(screen.getByLabelText('手机号')).toBeInTheDocument()
//         expect(screen.getByLabelText('密码')).toBeInTheDocument()
//         expect(screen.getByText('立即登录')).toBeInTheDocument()
//         expect(screen.getByText('前往注册')).toBeInTheDocument()
//     })
//
//     it('应该更新输入字段的值', () => {
//         renderLoginForm()
//
//         const phoneInput = screen.getByLabelText('手机号') as HTMLInputElement
//         const passwordInput = screen.getByLabelText('密码') as HTMLInputElement
//
//         fireEvent.change(phoneInput, { target: { value: '13800138000', name: 'phone' } })
//         fireEvent.change(passwordInput, { target: { value: 'password123', name: 'password' } })
//
//         expect(phoneInput.value).toBe('13800138000')
//         expect(passwordInput.value).toBe('password123')
//     })
//
//     it('成功登录后应该调用API并更新状态', async () => {
//         const mockResponse = {
//                 token: 'fake-token',
//                 userVO: { id: 1, name: 'Test User', phone: '13800138000' }
//             }
//         ;(userLogin as jest.Mock).mockResolvedValue(mockResponse)
//
//         renderLoginForm()
//
//         fireEvent.change(screen.getByLabelText('手机号'), {
//             target: { value: '13800138000', name: 'phone' }
//         })
//         fireEvent.change(screen.getByLabelText('密码'), {
//             target: { value: 'password123', name: 'password' }
//         })
//         fireEvent.submit(screen.getByRole('form'))
//
//         await waitFor(() => {
//             expect(userLogin).toHaveBeenCalledWith({
//                 phone: '13800138000',
//                 password: 'password123'
//             })
//             expect(localStorage.getItem('authToken')).toBe('fake-token')
//             expect(mockSetCurrentUser).toHaveBeenCalledWith(mockResponse.userVO)
//             expect(mockSetIsLoggedIn).toHaveBeenCalledWith(true)
//         })
//     })
//
//     it('登录失败应该显示错误', async () => {
//         const errorMessage = 'Invalid credentials'
//         ;(userLogin as jest.Mock).mockRejectedValue(new Error(errorMessage))
//
//         renderLoginForm()
//
//         fireEvent.change(screen.getByLabelText('手机号'), {
//             target: { value: '13800138000', name: 'phone' }
//         })
//         fireEvent.change(screen.getByLabelText('密码'), {
//             target: { value: 'wrongpassword', name: 'password' }
//         })
//         fireEvent.submit(screen.getByRole('form'))
//
//         await waitFor(() => {
//             expect(userLogin).toHaveBeenCalled()
//             expect(localStorage.getItem('authToken')).toBeNull()
//             expect(mockSetCurrentUser).not.toHaveBeenCalled()
//             expect(mockSetIsLoggedIn).not.toHaveBeenCalled()
//         })
//     })
//
//     it('点击注册按钮应该导航到注册页面', () => {
//         renderLoginForm()
//
//         fireEvent.click(screen.getByText('前往注册'))
//         expect(mockNavigate).toHaveBeenCalledWith('/user/register')
//     })
// })
