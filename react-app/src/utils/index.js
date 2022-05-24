// manage all utils
// 统一管理所有 util

import { http } from "./http"
import {
  getLocalToken,
  removeLocalToken, setLocalToken
} from './token'

export {
  http,
  setLocalToken,
  getLocalToken,
  removeLocalToken
}
