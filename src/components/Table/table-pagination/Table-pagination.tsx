import {
    Box,
    IconButton, Paper,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableFooter, TableHead,
    TablePagination,
    TableRow,
    useTheme
} from "@mui/material";
import {KeyboardArrowRight, KeyboardArrowLeft, LastPage, FirstPage} from '@mui/icons-material';
import PropTypes from "prop-types";
import {useGetAllUsersQuery} from "../../crud-users/crud.user.component.Api";
import {UsersModel} from "../../../models/Users.model";
import {useState} from "react";

function TablePaginationActions(props:any){
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event:any) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event:any) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event:any) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event:any) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
            </IconButton>
        </Box>
    );
}
TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function CustomPaginationActionsTable(){
    // @ts-ignore
    const {data,error,isLoading,isFetching,isSuccess} = useGetAllUsersQuery();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

    const handleChangePage = (event:any, newPage:any) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event:any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div>
            {isLoading && <h2>...Loading</h2>}
            {isFetching && <h2>...Fetching</h2>}
            {error && <h2>Something went wrong</h2>}
            {isSuccess && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>LastName</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Adresse</TableCell>
                                    <TableCell>Country</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : data
                            ).map((row:UsersModel) => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">{row.name}</TableCell>
                                    <TableCell component="th" scope="row">{row.lastName}</TableCell>
                                    <TableCell component="th" scope="row">{row.email}</TableCell>
                                    <TableCell component="th" scope="row">{row.adresse}</TableCell>
                                    <TableCell component="th" scope="row">{row.country}</TableCell>
                                </TableRow>
                            ))}

                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={3}
                                    count={data.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            )}
        </div>

    )
};