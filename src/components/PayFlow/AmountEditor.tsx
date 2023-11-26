import { VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import InputBox from '../widgets/InputBox'
import AppButton from '../widgets/AppButton'
import { FaChevronRight } from 'react-icons/fa'
import { SDK_NAME } from '../../utils/c'

interface AmountEditor {
    amount: number,
    minAmount: number,
    onAmountValid: (amount: number) => void,
    onSubmit: () => void
}
const AmountEditor: React.FC<AmountEditor> = ({ amount, minAmount, onAmountValid, onSubmit }) => {
    const [a, setA] = useState<number>(amount || 0)
    const [e, setE] = useState<string>()

    const validate = (amount: number, showError: boolean) => {
        setE("")
        if(!amount) {
            if(showError) setE("Enter an amount in dollar to deposit.")
            return false
        }
        if(amount < minAmount) {
            if(showError) setE(`The amount to deposit cannot be less than $${minAmount}`)
            return false
        }
        return true
    }

    const handleChange = (amt: number) => {
        //console.log(`${SDK_NAME}:/AmountEditor.handleChange.amount => `, amt, amount, a)
        setA(Number(amt))
        if(validate(amt, false)) onAmountValid(Number(amt))
    }

    const handleSubmit = () => {
        if(validate(a, true)) onSubmit()
    }

    return (
        <VStack p="1rem !important" w="100%" h="68vh" justifyContent="flex-start" alignItems="center">
            <InputBox 
                name="depositAmount"
                title="Deposit Amount" 
                helperText={`Enter the amount to deposit. The minimum amount is $${minAmount}`} 
                value={a} type={InputBox.TYPES.text} 
                numberUnit={`$`} 
                mb={4} 
                onChange={handleChange} 
                errorMessage={e}
            />
            <AppButton alignSelf="flex-start" onClick={handleSubmit} rightIcon={<FaChevronRight />}>
                Next
            </AppButton>
        </VStack>
    )
}

export default AmountEditor