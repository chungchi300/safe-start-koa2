const validator = require('validator')
const Membership = smartRequire('service/Membership')
const mail = smartRequire('mail')
const orm = smartRequire('orm')
module.exports = class MembershipCtrl {
  async login(ctx, next) {
    let { username, password } = ctx.request.body
    let user = await Membership.getUser(username, password)
    if (user == null) {
      throw Error('User not found')
    }
    ctx.body = user
  }
  async register(ctx, next) {
    let { name, phone, email, password, code } = ctx.request.body

    let user = await Membership.register(
      {
        name: name,
        phone: phone,
        email: email,
        password: password
      },
      code
    )

    ctx.body = user
  }
  async otp(ctx, next) {
    let { username } = ctx.request.body

    let otp = Membership.createOtp(username)

    if (validator.isEmail('' + username)) {
      await mail({
        to: username,
        subject: 'OTP',
        html: `<html><body>Your otp ${otp.code}</body></html>`
      })
    }
    ctx.body = { result: 'otp send' }
  }

  async resetPassword(ctx, next) {
    let { phone, email, newPassword, code } = ctx.request.body
    await Membership.resetPassword(
      await Membership.getOtp(email, phone, code),
      newPassword
    )
    ctx.body = { result: 'password reset' }
  }
}
