import React from 'react'
import { Box, Button, HStack, ResponsiveValue, Text, useColorModeValue } from "@chakra-ui/react";
import { ThreeDots } from "react-loader-spinner";


interface AppButtonProps {
  as?: any,
  children?: any,
  variant?: ResponsiveValue<any>,
  bgColor?: ResponsiveValue<any>,
  outlineColor?: ResponsiveValue<any>,
  leftIcon?: ResponsiveValue<any>,
  rightIcon?: ResponsiveValue<any>,
  loading?: boolean,
  disabled?: boolean,
  onClick?: (e: any) => void
  [x: string]: any
}
const AppButton: React.FC<AppButtonProps> = ({as, onClick, children, variant, bgColor, outlineColor, leftIcon, rightIcon, loading, disabled, ...props}) => {
    const bg = "green.500"//bgColor || useColorModeValue('colorAccent.light', 'colorAccent.dark')
    const outline = "green.500"//outlineColor || useColorModeValue("colorAccentDestination.light", "colorAccentDestination.dark")
    
    return (
      <Button as={as || "button"} cursor="pointer" disabled={disabled || loading} 
      onClick={(e) => {
        if(onClick && !(disabled || loading)) onClick(e) 
      }}
      display="inline-flex" justifyContent={"center"} alignItems="center"
      p={"0px 24px"} h="48px" letterSpacing={"0.03em"} textAlign="center" borderRadius="16px"
      bg={variant == "outline"? "transparent" : bg}
      border={variant == "outline"? "2px solid" : "none"}
      borderColor={variant == "outline"? outline : "transparent"}
      color={variant == "outline"? outline : "#fff"}
      boxShadow={(variant == "ghost" || variant == "outline")? "none" : "rgb(14 14 44 / 40%) 0px -1px 0px 0px inset"}
      opacity={variant == "ghost"? "0.8" : "1"} 
      transition="background-color 0.2s ease 0s, opacity 0.2s ease 0s"
      _hover={{
        opacity: "0.65",
        border: "none !important"
      }}
      _disabled={{
        opacity: "0.65",
        cursor: "not-allowed"
      }}
      {...props}>
        <HStack justifyContent="center" alignItems="center">
          {leftIcon? <Box mr="7px">{leftIcon}</Box> : null}
          <Text as="div">{children}</Text>
          {
            loading? 
            <Box as={ThreeDots} display="inline"
              width="20%"
              height="20%"
              color="#fff"
            /> 
            :
            rightIcon? <Box ml="7px">{rightIcon}</Box> : null
          }
        </HStack>
      </Button>
    )
}

export default AppButton