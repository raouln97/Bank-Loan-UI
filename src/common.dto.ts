export interface LoanResponse {
    applicationName: string
    applicationReason: string
    _id: string
    status: string
    loanAmount: number,
    balanceAmount: number,
    productId: string,
    productDetailsId: string,
    productName: string,
    productType: string,
    monthlyRepayment: string,
    createdDate: string,
  }

  export enum BankLoanInterface{
    UNDER_REVIEW="Under Review",
    APPROVED = "Approved",
    REJECTED= "Rejected",
    COMPLETED = "Completed"
}

export enum ProductType{
    CAR_LOAN="Car Loan",
    HOUSE_LOAN = "House Loan",
    INVESTMENT= "Investment",
    BUISNESS = "Buisness"
}

export interface PaymentHistoryDTO {
    _id: string,
    applicationId: string,
    paymentAmount: number,
    paymentDate: string,
}

export interface ProductDetailsDTO{
            loanTerm: number,
            interestRate: number,
            _id: string
}

export interface ProductListDTO  {
    _id: string,
    name: string,
    type: string,
    productDetails: ProductDetailsDTO[],
    __v: number
}