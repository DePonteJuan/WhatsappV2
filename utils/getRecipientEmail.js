const getRecipientEmail = (users, userLoggedIn) => 
  users?.filter(userToFilter => userToFilter !== userLoggedIn?.email)
export default getRecipientEmail
