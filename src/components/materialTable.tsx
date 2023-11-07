import React, {useState } from "react";
import { Box, Button, styled } from "@mui/material";
import { MaterialReactTable, useMaterialReactTable, MRT_GlobalFilterTextField as GlobalFilterTextField } from 'material-react-table'
  import { HiMagnifyingGlass } from "react-icons/hi2";
  import { MdFilterList } from "react-icons/md";
  import { FaMap } from "react-icons/fa6";
  import { IoIosRefresh } from "react-icons/io";
import { ApplicationDrawer } from "./applicationDrawer";
import { LoanResponse } from "../common.dto";

  interface MaterialTableProps {
    data: LoanResponse[];
    handleRefresh: () => Promise<void>;
    handleOpenModal: () => Promise<void>;
    handleDrawerClose: () => Promise<void>;
    columns: any;
    refreshLoading: boolean;
    isAdmin: boolean;
}

export const MaterialTable: React.FC<MaterialTableProps> = ({ data, handleRefresh, columns, refreshLoading, handleOpenModal, handleDrawerClose, isAdmin }) => {
    const [showColumnFilters, setShowColumnfilters] = useState(false)
    const [showColumns, setshowColumns] = useState(false)
    const [showSearchBox, setShowSearchBox] = useState(false)
    const [openDrawer, setIsOpenDrawer] = useState(false)
    const [selectedApplicationId, setSelectedApplicationId]=useState('')

    const handleDrawerModalOpen = (applicationId:string) => {
            setSelectedApplicationId(applicationId)
          if (openDrawer) {
            setIsOpenDrawer(false);
          }
    
          const timer = setTimeout(() => {
            setIsOpenDrawer(true);
          }, 5); 
        
          return () => clearTimeout(timer);
  
      };

      const handleDrawerModalClose = () => {
        handleDrawerClose()
        setIsOpenDrawer(false)
      }

    const StyledButton = styled(Button)(({ theme }) => ({
        '&:hover': {
          background: '#eaeaea'
        },
      }));

      const table = useMaterialReactTable({
        columns: columns,
        data: data, 
        enableDensityToggle: false,
        enableFullScreenToggle: false,
        initialState: {pagination: {pageSize: 50, pageIndex: 0}, density: 'compact',
        sorting: [
            {
              id: 'createdDate',
              desc: true,
            }]
        },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                handleDrawerModalOpen(row.original._id);
            },
            sx: {
              cursor: 'pointer',
            },
          }),
        renderTopToolbar: ({table}) => (
            <Box  style={{ display: "flex", justifyContent: "flex-start", gap: "1rem"}} borderBottom='1px solid #d4d4d4'>
              <StyledButton 
                variant="text" 
                color="primary"
                      onClick={handleOpenModal}
                  >
                    + {isAdmin ? 'New Product' : 'New Application'}
                </StyledButton>
              <StyledButton 
                variant="text" 
                color="primary"
                onClick={() =>{table.setShowGlobalFilter((prev) => !prev);setShowSearchBox((prev) => !prev)}}
              >
               <HiMagnifyingGlass />{" "}
                Search
              </StyledButton >
              <GlobalFilterTextField table={table} />
              <StyledButton 
                variant="text" 
                color="primary"
                onClick={() =>{ table.setShowColumnFilters((prev) => !prev); setShowColumnfilters((prev) => !prev)}}
              >
                <MdFilterList style={{ transform: "translateY(-1px)"}}/>{" "}
                Filter
              </StyledButton >
              <StyledButton 
                variant="text" 
                color="primary"
                onClick={() => {table.setShowColumnFilters((prev) => !prev); setshowColumns((prev) => !prev)}}
              >
                 <FaMap style={{ transform: "translateY(-1px)" }} />{" "}
                Columns
              </StyledButton >
              <StyledButton 
                variant="text" 
                color="primary"
                onClick={handleRefresh}
                disabled={refreshLoading}
              >
                 <IoIosRefresh style={{ transform: "translateY(-1px)" }} /> {" "}
                Refresh
              </StyledButton >
    
    
            </Box>
          )
        });
      return (
        <>
         <MaterialReactTable table={table} />
         <ApplicationDrawer open={openDrawer} applicationId={selectedApplicationId} setClose={handleDrawerModalClose} isAdmin={isAdmin} />
        </>
      )
}