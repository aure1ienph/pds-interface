export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  daily_differential_warning_notification?: boolean | null
  access: 'admin' | 'user'
}