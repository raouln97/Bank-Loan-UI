import { Button, CircularProgress, Drawer, FormControlLabel, Grid, IconButton, LinearProgress, MenuItem, Paper, Radio, RadioGroup, Select, TextField, Theme, Tooltip, Typography, styled, useMediaQuery, useTheme } from "@mui/material"
import React, { useEffect, useState } from "react"
import { getData, postData } from "../services/fetchService"
import { addMonthsFormat, formatDate } from "../services/dateTimeService"
import { BankLoanInterface, LoanResponse, PaymentHistoryDTO, ProductDetailsDTO, ProductListDTO, ProductType } from "../common.dto"
import { Close } from "@mui/icons-material"

interface CreateApplicationModalProps{
    applicationId: string
    open: boolean
    setClose: () => void
    isAdmin: boolean
}

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const ApplicationDrawer: React.FC<CreateApplicationModalProps>  = ({open, applicationId, setClose, isAdmin}) => {
    const [application, setApplication] = useState<LoanResponse>()
    const [paymentOption, setPaymentOption] = useState('monthlyRepayment');
    const [customAmount, setCustomAmount] = useState('');
    const [loanProgress, setLoanProgress] = useState(0)
    const [paymentHistory, setPaymentHistory]= useState<PaymentHistoryDTO[]>([])
    const [product, setProduct] = useState<ProductDetailsDTO>()
    const [loading, setLoading] = useState(false)
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


    const ColoredLinearProgress = styled(LinearProgress)(({ theme }: { theme: Theme }) => ({
        height: 10,
        borderRadius: 5,
        padding: 0,
        '.MuiLinearProgress-root': {
          backgroundColor: theme.palette.grey[300],
        },
        '.MuiLinearProgress-bar': {
          borderRadius: 5,
          backgroundColor: '#00cc66',
        },
      }));

    const handlePayment = async () => {
        await postData(`${BACKEND_URL}payments/create`,{applicationId,paymentAmount:paymentOption === 'monthlyRepayment'? application?.monthlyRepayment : customAmount} )
        
        setClose()
    };

    const handleStatusChange = async (newStatus: BankLoanInterface) => {
        await postData(`${BACKEND_URL}applications/update?id=${application?._id}`, {status: newStatus})
        fetchData().catch(console.error)
    };

    const computeTooltipMessage = () => {
        if (!application) return "";
        const paidAmount = (application.loanAmount - application.balanceAmount).toFixed(2);
        return `Paid: $${paidAmount}, Balance: $${application.balanceAmount.toFixed(2)}`;
    };

    const fetchData = async () => {
        setLoading(true)
        const response: LoanResponse = await getData(`${BACKEND_URL}applications?id=${applicationId}`)
        setApplication(response)
        if (response) {
            console.log('HIT!');
            setLoanProgress((response.loanAmount - response.balanceAmount) / response.loanAmount * 100);
        }
        const paymentHistoryResponse: PaymentHistoryDTO[] = await getData(`${BACKEND_URL}payments?id=${applicationId}`)
        setPaymentHistory(paymentHistoryResponse)

        const productRes: ProductListDTO = await getData(`${BACKEND_URL}products?id=${application?.productId}`)
        if (productRes){
            const [productDetails] = productRes.productDetails.filter((detail) => detail._id === application?.productDetailsId)
            setProduct(productDetails)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (open) {
            fetchData().catch(console.error)
        }
    }, [open]);

    return (
        <Drawer anchor="right"
        open={open}
        variant="persistent"
        ModalProps={{
          hideBackdrop: true,
          keepMounted: true, 
        }}
        >
            <Grid style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={setClose}>
                    <Close />
                </IconButton>
            </Grid>
            <Paper style={{ width: fullScreen? '100%' : '50vw', height: '100%', padding: '16px',display:'flex', justifyContent: loading ? 'center' : 'flex-start', alignItems: loading ? 'center' : 'flex-start'}}>
                {loading &&
                    <CircularProgress />
                }
                {!loading &&
                <Grid item container flexDirection='row' display='flex' spacing={2}>
                    <Grid item xs={7} container flexDirection='column' display='flex' borderRight='0.5px Solid #ccc' style={{overflowX: 'hidden', overflowY: 'auto'}}>
                        {application && product &&
                        <Grid item container flexDirection='column' display='flex' spacing={1}>
                            <Grid item>
                            <Typography variant="h6">Application Details</Typography>
                            </Grid>

                            <Grid item>
                            <Typography><strong>Name:</strong> {application?.applicationName}</Typography>
                            </Grid>

                            <Grid item >
                            <Typography style={{ whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word',hyphens: 'auto',display: 'block',maxWidth: '100%'}}><strong>Reason:</strong>{application?.applicationReason}</Typography>
                            </Grid>

                            {isAdmin && 
                                <Grid item maxWidth= '10vw' display='flex' alignItems='center'>
                                    <Typography><strong>Status:</strong></Typography>
                                    <Select
                                        value={application?.status}
                                        onChange={(e) => handleStatusChange(e.target.value as BankLoanInterface)}
                                        variant='standard'
                                        style={{marginLeft: '10px'}}
                                    >
                                        {Object.entries(BankLoanInterface).map(([key, value]) => (
                                            <MenuItem key={key} value={value}>
                                                {value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            }

                        {!isAdmin && 
                            <Grid item>
                            <Typography><strong>Status:</strong> {application?.status}</Typography>
                            </Grid>
                        }

                            <Grid item>
                            <Typography><strong>Loan Amount:</strong> ${application?.loanAmount}</Typography>
                            </Grid>

                            <Grid item>
                            <Typography><strong>Loan Interest Rate:</strong> {product?.interestRate}%</Typography>
                            </Grid>

                            <Grid item>
                            <Typography><strong>Loan Term:</strong> {product?.loanTerm} Months</Typography>
                            </Grid>

                            <Grid item>
                            <Typography><strong>Loan Completion Date:</strong> {addMonthsFormat(application.createdDate, product?.loanTerm)}</Typography>
                            </Grid>

                            <Grid item>
                            <Typography><strong>Loan Amount:</strong> ${application?.loanAmount}</Typography>
                            </Grid>

                            <Grid item>
                            <Typography><strong>Balance Amount:</strong> ${application?.balanceAmount}</Typography>
                            </Grid>

                            <Grid item>
                            <Typography><strong>Product Name:</strong> {application?.productName}</Typography>
                            </Grid>

                            <Grid item>
                            <Typography><strong>Product Type:</strong> {application?.productType}</Typography>
                            </Grid>

                            <Grid item>
                                <Tooltip title={computeTooltipMessage()} arrow placement="top">
                                    <ColoredLinearProgress variant="determinate" value={loanProgress} />
                                </Tooltip>
                            <Typography><strong>Monthly Repayment:</strong> {parseFloat(application?.monthlyRepayment).toFixed(2)}</Typography>
                            </Grid>

                            <Grid item>
                            <Typography><strong>Created Date:</strong> {new Date(application?.createdDate).toLocaleDateString()}</Typography>
                            </Grid>
                            {application.status === 'Approved' && !isAdmin &&
                            <>
                                <Grid item>
                                <Typography variant="h6">Payment</Typography>

                                <RadioGroup 
                                    value={paymentOption} 
                                    onChange={(e) => setPaymentOption(e.target.value)}
                                >
                                    <FormControlLabel 
                                        value="monthlyRepayment" 
                                        control={<Radio />} 
                                        label={`Monthly Repayment Amount: $${parseFloat(application?.monthlyRepayment).toFixed(2)}`} 
                                    />

                                    <FormControlLabel 
                                        value="customAmount" 
                                        control={<Radio />} 
                                        label="Custom Amount" 
                                    />
                                </RadioGroup>

                                {paymentOption === 'customAmount' && (
                                    <TextField 
                                        label="Enter Custom Amount"
                                        variant="outlined"
                                        type="number"
                                        fullWidth
                                        value={customAmount}
                                        onChange={(e) => setCustomAmount(e.target.value)}
                                    />
                                )}

                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={handlePayment} 
                                    style={{ marginTop: '8px' }}>
                                    Pay
                                </Button>
                                </Grid>
                            </>
                        }
                        </Grid>
                        }

                    </Grid>
                    <Grid item xs={5} container flexDirection='column' display='flex'>
                        <Grid item>
                            <Typography variant="h6">Payment History</Typography>
                        </Grid>
                        {paymentHistory.length > 0 && paymentHistory.map((payments, index) => {
                            return(
                                <Grid borderBottom='2px solid #ccc' key={index}> 
                                    <Grid item key={`${index} - 1`}> 
                                        <Typography variant="body1"><strong>Payment {index + 1}</strong></Typography>
                                    </Grid>
                                    <Grid item key={`${index} - 2`}>
                                        <Typography variant="body1">Amount: {payments.paymentAmount}</Typography>
                                    </Grid>
                                    <Grid item key={`${index} - 3`}> 
                                        <Typography variant="body1">Date: {formatDate( new Date(payments.paymentDate))}</Typography>
                                    </Grid>
                                </Grid>
                            )

                        })}
                    </Grid>
                    
                </Grid>
            }
            </Paper>
        </Drawer>
    )

}