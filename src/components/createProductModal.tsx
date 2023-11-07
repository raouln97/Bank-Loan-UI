import React, {useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { TextField, MenuItem, InputAdornment, Select, FormControl, InputLabel, Box, Button, styled, CircularProgress } from '@mui/material';
import { postData } from '../services/fetchService';
import { ProductType } from '../common.dto';

type FormData = {
  name: string;
  type: ProductType;
  productDetails: [
    {
        loanTerm: number,
        interestRate: number,
    }
],
__v: number
};

interface CreateApplicationModalProps{
    handleCloseModal: () => Promise<void>
}

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CreateProductForm: React.FC<CreateApplicationModalProps> = ({handleCloseModal}) => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
        productDetails: [{ loanTerm: 12, interestRate: 0}]
      }
    });
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)

const { fields, append, remove } = useFieldArray({
    control,
    name: "productDetails",
  });


  const StyledButton = styled(Button)(({ theme }) => ({
    '&:hover': {
      background: '#eaeaea'
    },
  }));

  const onSubmit = async (data: FormData) => {
    setIsSubmitLoading(true)
    console.log(data);
    await postData(`${BACKEND_URL}products/create`, data)
    handleCloseModal()
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box marginBottom={2} marginTop={1}>
            <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} label="Product Name" error={Boolean(errors.name)} fullWidth />}
            />
      </Box>

      <Box marginBottom={2}>
        <FormControl fullWidth>
        <InputLabel id="product-type-label">Product Type</InputLabel>
        <Controller
          name="type"
          control={control}
          defaultValue={ProductType.CAR_LOAN}
          render={({ field }) => (
            <Select labelId="product-type" label="Product Type" fullWidth  error={Boolean(errors.type)} {...field}>
                {Object.entries(ProductType).map(([key, value]) => (
                        <MenuItem key={key} value={value}>
                            {value}
                        </MenuItem>
                ))}
              </Select>
            )}
        />
        </FormControl>

      </Box>

      {fields.map((field, index) => (
        <Box key={field.id} marginBottom={2}>
          <Controller
            name={`productDetails[${index}].loanTerm` as any}
            control={control}
            defaultValue={field.loanTerm}
            render={({ field }) => (
              <TextField {...field} label="Loan Term In Months" type='number' fullWidth  InputProps={{
                endAdornment: <InputAdornment position="start">Months</InputAdornment>,
              }}/>
            )}
          />
          <Controller
            name={`productDetails[${index}].interestRate` as any}
            control={control}
            defaultValue={field.interestRate}
            render={({ field }) => (
              <TextField {...field} style={{marginTop: '20px'}} label="Interest Rate/Annum" type='number' fullWidth  InputProps={{
                endAdornment: <InputAdornment position="start">%</InputAdornment>,
              }}/>
            )}
          />
          <Button onClick={() => remove(index)}>Remove</Button>
        </Box>
      ))}

      <Button
        type="button"
        onClick={() => append({ loanTerm: 12, interestRate: 0})}
      >
        Add New
      </Button>
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

export default CreateProductForm
