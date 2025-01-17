import React from 'react'
import { CSSTransition } from 'react-transition-group'
import SplashScreen from './splashscreen'
import MainScreen from './mainscreen'
import styles from './index.scss'
import { AuthInfo } from '../../types/common'
import { getApiBaseUrl } from '../../config'
import AuthService from '../../services/AuthService'

type AppProps = {}

type AppState = {
  loaded: boolean
  title?: string
  subtitle?: string
  authInfo: AuthInfo
}

const transition = {
  appear: styles.mainScreenAppear,
  appearActive: styles.mainScreenAppearActive,
}

const splashTransition = {
  exit: styles.splashScreenExit,
  exitActive: styles.mainScreenExitActive,
}

export class App extends React.Component<AppProps, AppState> {
  state: AppState = {
    loaded: false,
    authInfo: {
      loggedIn: false,
    },
  }

  constructor(props) {
    super(props)

    this.fetchSiteProps = this.fetchSiteProps.bind(this)
  }

  componentDidMount() {
    this.fetchSiteProps()
  }

  fetchSiteProps() {
    const url = getApiBaseUrl()
    fetch(url + 'site-props', AuthService.getAuthHeader())
      .then(response => response.json())
      .then(data =>
        this.setState({
          loaded: true,
          title: data.title,
          subtitle: data.subtitle,
          authInfo: { loggedIn: data.logged_in, userName: data.full_name, reload: this.fetchSiteProps },
        })
      )
  }

  render() {
    const { loaded, title, subtitle, authInfo } = this.state

    return (
      <>
        {loaded && (
          <CSSTransition in appear timeout={1000} classNames={transition}>
            <MainScreen title={title!} subtitle={subtitle!} authInfo={authInfo} />
          </CSSTransition>
        )}
        <CSSTransition in={!loaded} exit unmountOnExit timeout={400} classNames={splashTransition}>
          <SplashScreen />
        </CSSTransition>
      </>
    )
  }
}

export default App
