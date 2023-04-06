export const AUTH_USER_QUERY = `
  {
    me {
      id
      first_name
      last_name
      timezone
      name
      email
      hasCasePermission
      hasPassword
      hasCustomer
      isSubscribed
      isOwner
      roles {
        name
      }
      avatar {
        url
      }
    }
  }
`

export const BILLING_INFO_QUERY = `
  {
    me {
      customer_metadata {
        name
        email
        address {
          line1
          line2
          city
          state
          country
          postal_code
        }
      }
      payment_method_metadata {
        card {
          last4
          brand
          exp_month
          exp_year
        }
      }
    }
  }
`
