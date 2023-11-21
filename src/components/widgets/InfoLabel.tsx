import React from 'react'
import { FaInfoCircle } from "react-icons/fa"
import { 
    Box, HStack, ResponsiveValue, Text 
} from "@chakra-ui/react"
import Swal from 'sweetalert2'

interface InfoLabelProps {
    children?: any, as?: any, info?: string | string[], textTransform?: ResponsiveValue<any>,
    [x: string]: any
}
const InfoLabel: React.FC<InfoLabelProps> = ({children, as, info, textTransform, ...props}) => {

    const onInfo = (i: string) => {
        Swal.fire({
          icon: "info",
          title: children || "",
          text: i,
          confirmButtonText: "Ok",
          showCancelButton: false
        })
    }

    return (
        <HStack flexWrap="wrap" justifyContent="flex-start" alignItems="center" {...props}>
          <Text mx="0px !important" mb="0px !important" as={as || "div"} 
          textTransform={textTransform || "capitalize"}>{children}</Text>
          {
            !info? null : 
            <Box cursor="pointer" marginInlineStart="0px !important" marginInlineEnd="0px !important" p="3px"
           onClick={() => onInfo(info as string)}>
               <FaInfoCircle />
            </Box>
          }
        </HStack>
    )
}

export default InfoLabel