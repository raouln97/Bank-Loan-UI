import { Dialog, DialogContent, DialogTitle, Grid} from "@mui/material"
import { MaterialTable } from "../components/materialTable"
import React, { useEffect, useMemo, useState } from "react"
import { MRT_ColumnDef } from "material-react-table";
import { getData } from "../services/fetchService";
import CreateApplicationForm from "../components/createApplicationModel";
import { formatDateTime } from "../services/dateTimeService";
import CreateProductForm from "../components/createProductModal";
import { LoanResponse } from "../common.dto";

interface UserApplicationsProps {
  context:{
    isAdmin: boolean
  }
}

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const UserApplications: React.FC<UserApplicationsProps> = ({ context }) =>{
    const [getLoansResponse, setGetLoansResponse] = useState([])
    const [refreshLoading, setRefreshLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)  


    const fetchData = async () => {
        const response = await getData(`${BACKEND_URL}applications`)
        setGetLoansResponse(response)
    }

    const handleOpenModal = async () => {
        setIsModalOpen(true)
      };

    const handleCloseModal = async () => {
        await fetchData().catch(console.error);
        setIsModalOpen(false)
    };

    const handleRefresh = async () => {
        setRefreshLoading(true)
        await fetchData().catch(console.error);
        setRefreshLoading(false)
      };

    const columns = useMemo<MRT_ColumnDef<LoanResponse>[]>(
        () => [
          {
            header: 'Application Name',
            accessorKey: 'applicationName',
            size: 150
          },
          {
            header: 'Status',
            accessorKey: 'status',
            size: 100
          },
          {
            header: 'Loan Amount',
            accessorKey: 'loanAmount',
            size: 100,
            Cell: props => (
                <div>
                  <span>$</span>{" "}
                  {props.row.original.loanAmount}
                </div>
              ),
          },
          {
            header: 'Monthly Repayment',
            accessorKey: 'monthlyRepayment',
            Cell: props => (
                <div>
                  <span>$</span>{" "}
                  {parseFloat(props.row.original.monthlyRepayment).toFixed(2)}
                </div>
              ),
            size: 100
          },
          {
            header: 'Created Date',
            accessorKey: 'createdDate',
            size: 150,
            Cell: props => (
              <div>
                {formatDateTime(new Date (props.row.original.createdDate))}
              </div>
            ),
          },
        ],
        [],
      );

      useEffect(() => {

        fetchData().catch(console.error)
    },[])

    return (
        <Grid margin='20px'>
            <MaterialTable  data={getLoansResponse ?? []} handleRefresh={handleRefresh} columns={columns!} refreshLoading={refreshLoading} handleOpenModal={handleOpenModal} handleDrawerClose={fetchData} isAdmin={context.isAdmin}/>
                <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth='md' fullWidth style={{justifyContent: 'center', display:'flex', overflow: 'hidden'}}>
                    <DialogTitle>{!context.isAdmin ? "Loan Application" : "Create New Product"}</DialogTitle>
                    <DialogContent
                    sx={{ width:{ xs: '90vw', sm: '70vw', md: '50vw', lg: '30vw' }, background: 'white'}}
                    >
                      {!context.isAdmin? 
                        <CreateApplicationForm handleCloseModal={handleCloseModal} /> :
                        <CreateProductForm handleCloseModal={handleCloseModal}  />
                      }
                    </DialogContent>
                </Dialog>
        </Grid>
    )
}