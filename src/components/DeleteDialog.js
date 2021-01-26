import React from 'react';

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { deleteEmployeeInfo } from '../apiCalls'


function UpdateDialog(props) {


    const { open, handleClose, employeeInfo, updateRecord } = props;
    const { employeeId } = employeeInfo;

    const handleDeleteClick = async () => {

        const data = await deleteEmployeeInfo(employeeInfo.employeeId);
        console.log("DELETE", data);
        updateRecord();
        handleClose()
    };


    return (
        <div>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth='sm' fullWidth>
                <DialogTitle id="form-dialog-title">Delete Employee Information</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to Delete {`(${employeeId}) `}Employee Record ?
                    </DialogContentText>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        No
                    </Button>
                    <Button onClick={handleDeleteClick} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default UpdateDialog;