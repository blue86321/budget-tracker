import { makeAutoObservable } from 'mobx';
import { http } from 'utils';
import TestData from 'utils/test';


export default class PartnerStore {
  partnerList = []
  inviteList = []

  constructor() {
    makeAutoObservable(this)
  }

  sendInvitation = async (partner, bookInfo) => {
    try {
      const { bookId } = bookInfo
      const { partner: username } = partner
      const formatParams = { username, bookId }
      const res = await http.post('/book/partner/invite', { ...formatParams })
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message
      throw errorMessage
    }
  }

  getInvite = async () => {
    try {
      const res = await http.get('/user/partner/invite')
      this.setInviteList(res.data)
    } catch (e) {
      this.setInviteList(TestData.inviteList)
      console.log("server side is down", e)
    }
  }

  setInviteList = (values) => this.inviteList = values

  respondInvitation = async (values) => {
    const { inviteId, accept } = values
    const formatParams = { inviteId, accept }
    try {
      await http.post('/user/partner/invite', formatParams)
    } catch (e) {
      console.log("server side is down", e)
    } finally {
      this.setInviteList(this.inviteList.filter(item => item.inviteId !== inviteId))
    }
  }

  getPartnerList = async () => {
    try {
      const res = await http.get('/user/partner/list')
      this.setPartnerList(res.data)
    } catch (e) {
      this.setPartnerList(TestData.partnerList)
      console.log("server side is down", e)
    }
  }

  setPartnerList = (values) => this.partnerList = values

  revokePartner = async (values) => {
    try {
      const { bookId, partnerUsername } = values
      const formatParams = { bookId, partnerUsername }
      try {
        const res = await http.delete('/user/partner', { data: formatParams })
      } catch (e) {
        console.log("server side is down", e)
        throw e
      } finally {
        // update partnerList (front-end)
        this.setPartnerList(
          this.partnerList.reduce(
            (result, partner) => {

              if (partner.username !== partnerUsername) {
                result.push(partner)
                return result
              }
              const newPartner = {...partner}
              newPartner.bookStatList = partner.bookStatList.filter(book => book.bookId !== bookId)
              if (newPartner.bookStatList.length > 0) {
                result.push(newPartner)
              }
              return result
            }, []
          )
        )
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message
      throw errorMessage
    }
  }
}
