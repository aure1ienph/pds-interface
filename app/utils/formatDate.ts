export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return ''
  
  try {
    const cleanedDateString = String(dateString).replace(/"T"/g, 'T').replace(/"Z"/g, 'Z')
    const date = new Date(cleanedDateString)
  
    if (isNaN(date.getTime())) {
      return dateString
    }
    
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  } catch {
    return dateString
  }
}