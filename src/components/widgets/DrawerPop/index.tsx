import React, { useEffect, useState } from 'react'
import { 
    Box, HStack, 
    Drawer, DrawerBody, DrawerContent, DrawerFooter, 
    DrawerHeader, DrawerOverlay, Text 
} from "@chakra-ui/react"
import { FaTimes } from "react-icons/fa"
import { isVoid } from '../../../utils/f'


interface DrawerPopProps {
    bg?: any, 
    color?: any, 
    h?: any, height?: any,
    w?: any, width?: any,
    maxH?: any, maxHeight?: any,
    maxW?: any, maxWidth?: any,
    children: any, 
    placement?: any, 
    onClose?: () => void, 
    isOpen: boolean, 
    isClosable?: boolean, closeOnOverlayClick?: boolean,
    title?: any, 
    footer?: any,
    hideModeSwitch?: boolean,
    [x: string]: any
}
const DrawerPop: React.FC<DrawerPopProps> = ({
    bg, 
    color, 
    children, 
    placement, 
    onClose, 
    isOpen, 
    isClosable, closeOnOverlayClick,
    title, 
    footer, hideModeSwitch,
    h, height, maxH, maxHeight,
    w, width, maxW, maxWidth, ...props
}) => {
    
    const [height2, setHeight] = useState<string>()
    const [width2, setWidth] = useState<string>()
    
    const [borderTopLeftRadius, setBorderTopLeftRadius] = useState<{[x: string]: string} | string>({})
    const [borderTopRightRadius, setBorderTopRightRadius] = useState<{[x: string]: string} | string>({})
    const [borderBottomLeftRadius, setBorderBottomLeftRadius] = useState<{[x: string]: string} | string>({})
    const [borderBottomRightRadius, setBorderBottomRightRadius] = useState<{[x: string]: string} | string>({})
    useEffect(() => {
        if(placement === "left") {
            setBorderTopLeftRadius("0px")
            setBorderTopRightRadius("32px")
            setBorderBottomLeftRadius("0px")
            setBorderBottomRightRadius("32px")
            setHeight(height || h)
            setWidth(width || w)

        } else if(placement === "right") {
            setBorderTopLeftRadius("32px")
            setBorderTopRightRadius("0px")
            setBorderBottomLeftRadius("32px")
            setBorderBottomRightRadius("0px")
            setHeight(height || h)
            setWidth(width || w)

        } else if(placement === "top") {
            setBorderTopLeftRadius("0px")
            setBorderTopRightRadius("0px")
            setBorderBottomLeftRadius("32px")
            setBorderBottomRightRadius("32px")
            setHeight(height || h || "50vh")
            setWidth(width || w)

        } else if(placement === "bottom") {
            setBorderTopLeftRadius("32px")
            setBorderTopRightRadius("32px")
            setBorderBottomLeftRadius("0px")
            setBorderBottomRightRadius("0px")
            setHeight(height || h || "60vh")
            setWidth(width || w)
        }
        
    }, [ placement, height, width ])
    
    
    return (
        <Drawer placement={placement} 
            onClose={onClose? onClose : () => {}} isOpen={isOpen} 
            closeOnOverlayClick={isVoid(closeOnOverlayClick)? true : closeOnOverlayClick}>
            <DrawerOverlay />
                <DrawerContent bg={bg} color={color} 
                h={height2} w={width2} maxH={maxH || maxHeight || height2} maxW={maxW || maxWidth || width2} 
                borderTopLeftRadius={borderTopLeftRadius} borderTopRightRadius={borderTopRightRadius} 
                borderBottomLeftRadius={borderBottomLeftRadius} 
                borderBottomRightRadius={borderBottomRightRadius}
                /*left={left} right={right} top={top} bottom={bottom}*/ {...props}>
                    
                <DrawerHeader borderBottomWidth='1px' w="100%" display="flex" 
                    justifyContent={"space-between"} alignItems="center">
                    <Text as="div" fontSize={{base: "1.1rem", md: "1.3rem"}} textTransform="capitalize">
                        {title}
                    </Text>
                    <HStack>
                        {/*
                            !hideModeSwitch?
                            <ThemeSwitch /> : null*/
                        }
                        {
                            onClose && (isClosable || isClosable === undefined)?
                            <Box onClick={onClose} cursor="pointer" 
                            display={"block"}>
                                <FaTimes size="24px" />
                            </Box>
                            :
                            null
                        }
                    </HStack>
                    
                </DrawerHeader>

                <DrawerBody {...props}>
                    {children}
                </DrawerBody>
                
                {
                    footer?
                    <DrawerFooter>
                        {footer}
                    </DrawerFooter>
                    : null
                }
            </DrawerContent>
        </Drawer>
    )
}

export default DrawerPop