import createBrowserHistory from 'history/createBrowserHistory';
import {checkSession} from './auth'

const getConfirmation = async (path, callback) => {
    let authenticated = await checkSession()

    if(authenticated) {
        if(path == '/login' || path == '/')
            return history.push('/home')
        return callback(true)
    }
    else {
        if(path == '/login' || path == '/')
            return callback(true)
        
        return history.push('/login')
    }
}

const history = createBrowserHistory({getUserConfirmation:getConfirmation});
// history.listen((location) => {
//     debugger
//     return "hgh"
// });

// history.block(({ pathname }) => {
//     debugger
// });

export default history;