import { createContext, useContext } from "react";
import BookStore from "./book.store";
import FinanceStore from "./finance.store";
import LoginStore from "./login.store";
import PartnerStore from "./partner.store";
import UserStore from "./user.store";

// manage store
// 统一管理 store
class RootStore {
  constructor() {
    this.loginStore = new LoginStore()
    this.userStore = new UserStore()
    this.financeStore = new FinanceStore()
    this.bookStore = new BookStore()
    this.partnerStore = new PartnerStore()
    // ...
  }
}

// use ReactContext to pack
// 利用 ReactContext 封装
const rootStore = new RootStore()
const context = createContext(rootStore)
const useStore = () => useContext(context)

export { useStore }
