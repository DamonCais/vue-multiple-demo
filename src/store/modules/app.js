import Cookies from 'js-cookie'
const app = {
  state: {
    laravel_session: Cookies.get('laravel_session') || 'eyJpdiI6Im01SEFKcG5NaWRsY0c0N0F4b2pxUkE9PSIsInZhbHVlIjoiTEIwQWZwWXBNTzd2TmFFbGk3QVJBK1F6cXZPR2xSSGxGM1FYUFwvV3NpSk1XSnhwaEpmblAzVFc1Z1ZaQnhobStvWkVTdCsrUm5sUmd5WnBvcTF0OHhRPT0iLCJtYWMiOiJhYjFmMWVmMjg1MjQ2NWI0ZTU5OWJiZDVmZTk0N2E4NjU1OTA5MTY3NjcxZmY2ODJjYjY5OWY3NTk0MjZhM2EyIn0%3D'
  },
  mutations: {
    SET_SESSION: (state, session) => {
      state.laravel_session = session
      Cookies.set('laravel_session', session)
    },
  },
  actions: {
    setSession({
      commit
    }, session) {
      commit('SET_SESSION', session)
    },
  }
}

export default app
