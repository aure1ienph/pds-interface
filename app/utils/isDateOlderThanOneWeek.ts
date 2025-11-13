export const isDateOlderThanOneWeek = (dateString: string | null | undefined): boolean => {
  if (!dateString) return false
  
  try {
    const cleanedDateString = String(dateString).replace(/"T"/g, 'T').replace(/"Z"/g, 'Z')
    const date = new Date(cleanedDateString)
    
    if (isNaN(date.getTime())) return false
    
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    return date < oneWeekAgo
  } catch {
    return false
  }
}