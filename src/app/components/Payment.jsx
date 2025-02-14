import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Radio, RadioGroup, FormControlLabel, FormControl, Box, Typography } from '@mui/material';
import Image from 'next/image'
import { clearCard } from '@/store/cartSlice';

import { useAppDispatch } from '@/utils/hooks';

const Payment = ({ openPayment, orderTotal }) => {

    
    return (
        <Dialog>
            
        </Dialog>
    );
};

export default Payment;