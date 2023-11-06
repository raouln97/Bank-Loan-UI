import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, MenuItem, InputAdornment, Select, FormControl, InputLabel, Box, Button, styled, CircularProgress } from '@mui/material';
import { getData, postData } from '../services/fetchService';

type FormData = {
  productId: string;
  productDetailsId: string;
  applicationName: string;
  applicationReason: string;
  productType: string;
  loanAmount: number;
};

type ProductList = {
    _id: string,
    name: string,
    type: string,
    productDetails: [
        {
            loanTerm: number,
            interestRate: number,
            _id: string
        }
    ],
    __v: number
}

interface CreateApplicationModalProps{
    handleCloseModal: () => Promise<void>
}

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


const CreateApplicationForm: React.FC<CreateApplicationModalProps> = ({handleCloseModal}) => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const[productList, setProductList] = useState<ProductList[]>([])
  const[product, setProduct] = useState<ProductList>()
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)

  const fetchData = async () => {
    const response = await getData(`${BACKEND_URL}products`)
    setProductList(response)
}

  const StyledButton = styled(Button)(({ theme }) => ({
    '&:hover': {
      background: '#eaeaea'
    },
  }));

  const onSubmit = async (data: FormData) => {
    setIsSubmitLoading(true)
    const finalisedData = {...data, balanceAmount: data.loanAmount, productName: product?.name, productType: product?.type}
    console.log(finalisedData);
    await postData(`${BACKEND_URL}applications/create`, finalisedData)
    handleCloseModal()
  };

  useEffect(() => {

    fetchData().catch(console.error)
},[])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <Box marginBottom={2} marginTop={1}>
        <FormControl fullWidth>
          <InputLabel id="products-label">Products</InputLabel>
          <Controller
            name="productId"
            control={control}
            defaultValue=""
            render={({ field }) => (
            <Select labelId="products-label" label="Products"   error={Boolean(errors.productId)} {...field}  onChange={(event) => {
                const selectedValue = event.target.value;
                const productObject = productList.find(product => product._id === selectedValue);
                field.onChange(productObject?._id);
                setProduct(productObject);
              }}>
                {productList && productList.map((product, index)=>{
                    return(
                        <MenuItem key={product._id} value={product._id}>{product.name}</MenuItem>
                    )
                })}
              </Select>
            )}
          />
        </FormControl>
      </Box>
      {product &&
        <Box marginBottom={2}>
            <FormControl fullWidth>
            <InputLabel id="loan-term-label">Loan Term</InputLabel>
            <Controller
                name="productDetailsId"
                control={control}
                defaultValue=""
                rules={{ required: 'Product Details is required' }}
                render={({ field }) => (
                <Select labelId="loan-term-label" label="Loan Term" error={Boolean(errors.productDetailsId)} {...field} onChange={(event) => {
                    const selectedValue = event.target.value;
                    const productObject = product.productDetails.find(detail => detail._id === selectedValue);
                    field.onChange(productObject?._id);
                }}>
                    {product && product.productDetails.map((details, index)=>{
                        return(
                            <MenuItem key={details._id} value={details._id}>{details.loanTerm} Months at Annual I/R:{details.interestRate}</MenuItem>
                        )
                    })}
                </Select>
                )}
            />
            </FormControl>
        </Box>
        }
      <Box marginBottom={2}>
        <Controller
          name="applicationName"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} label="Application Name" error={Boolean(errors.applicationName)} fullWidth />}
        />
      </Box>

      <Box marginBottom={2}>
        <Controller
          name="applicationReason"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} label="Application Reason" error={Boolean(errors.applicationReason)} fullWidth multiline rows={4} />}
        />
      </Box>

      <Box marginBottom={2}>
        <TextField label="Loan Type" value={product?.type || ""} fullWidth disabled />
      </Box>

      <Box marginBottom={2}>
        <Controller
          name="loanAmount"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Loan Amount"
              fullWidth
              error={Boolean(errors.loanAmount)}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          )}
        />
      </Box>
      <Box justifyContent='flex-end' display='flex'>
            {isSubmitLoading &&
                <CircularProgress />
            }
            {!isSubmitLoading &&
            <StyledButton 
                variant="text" 
                color="primary"
                type="submit"
              >
                Submit
              </StyledButton >
            }
      </Box>
    </form>
  );
};

export default CreateApplicationForm
