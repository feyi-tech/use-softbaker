import React from 'react'
import { Text } from "@chakra-ui/react"

interface LinkProps {
    children: any,
    disabled?: boolean | null | undefined,
    onClick?: (e: any) => void | null | undefined,
    [x: string]: any
}
const Link: React.FC<LinkProps> = ({ children, disabled, onClick, ...props }) => {

    return (
        <Text cursor={disabled? "not-allowed" : "pointer"} 
        _hover={{
            opacity: "0.3"
        }}
        onClick={(e) => {
            if(onClick) onClick(e)
        }} {...props}>
            {children}
        </Text>
    )
}

export default Link