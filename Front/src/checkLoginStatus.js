function isUserLoggedIn() {
    return !!localStorage.getItem('userToken') || localStorage.getItem('isLoggedIn') === 'true';
  }
  