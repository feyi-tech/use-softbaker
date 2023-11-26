import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Divider,
  Flex,
  Image,
  VStack
} from '@chakra-ui/react';
import { Tool } from '../PayFlow/types';
import { TOOL_FALLBACK_IMAGE } from '../../utils/base64Images';
import PleaseWaitForX from '../widgets/PleaseWaitForX';
import { Theme } from '../../theme.type';
import { LIGHT_THEME } from '../SoftBakerProvider';

interface ToolSwitchProps {
  currentTool?: Tool | null | undefined;
  tools?: Tool[] | null | undefined;
  show: boolean;
  onClose: () => void;
  theme: Theme
}

const ToolSwitch: React.FC<ToolSwitchProps> = ({ currentTool, tools, show, onClose, theme }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(LIGHT_THEME)
    useEffect(() => {
        if(theme) setCurrentTheme(theme)
    }, [theme])

  if (!show) return null;

  return (
    <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent bg="rgb(39, 38, 44)">
        <ModalHeader mb="0px !important">
          {
            currentTool?
            <Box w="auto" p="0.5rem">
                <Button
                    id={`tool-switch-button-${currentTool.id}`}
                    onClick={() => {
                        onClose();
                    }}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    _hover={{ opacity: '0.3 !important' }}
                >
                    <Box aria-label={currentTool.name} title={currentTool.name} mr="0.5rem">
                        {currentTool.name}
                    </Box>
                    <Image 
                        src={currentTool.siteLogoUrl} 
                        alt={currentTool.name} 
                        w="20px" h="20px" 
                        fallbackSrc={TOOL_FALLBACK_IMAGE}
                    />
                </Button>
            </Box> : null
          }
        </ModalHeader>
        <Divider my="0px !important" />
        <ModalCloseButton color="#fff" _hover={{opacity: 0.7}} />
        <ModalBody>
          {
            tools && tools.length > 0 && currentTool?
            <Flex w="100%" flexWrap="wrap">
                {tools.map((tool) => {
                    if (tool.id == currentTool.id) return null;
                    return (
                        <Box w="auto" p="0.5rem" key={tool.id}>
                            <Button
                                w="100%"
                                id={tool.id}
                                onClick={() => {
                                  if (tool.isActive) location.href = tool.siteUrl;
                                  onClose();
                                }}
                                isDisabled={!tool.isActive}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                opacity={tool.isActive ? '1 !important' : '0.5 !important'}
                                _hover={{ opacity: '0.3 !important' }}
                            >
                               
                                <VStack justifyContent="center" alignItems="center" gap="0px !important" mr="0.5rem">
                                  <Box aria-label={tool.name} title={tool.name}>
                                    {tool.name}
                                  </Box>
                                  {tool.isActive ? null : <Box fontSize="11px">(Coming Soon)</Box>}
                                </VStack>
                                <Image 
                                  src={tool.siteLogoUrl} 
                                  alt={tool.name} 
                                  w="20px" h="20px" 
                                  fallbackSrc={TOOL_FALLBACK_IMAGE}
                                />
                            </Button>
                        </Box>
                    )
                })}
            </Flex>
            :
            <Flex flexDir="column" pos="relative" w="100%" h="100%" justifyContent="center" alignItems="center" p="1rem">
              <PleaseWaitForX />
            </Flex>
          }
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ToolSwitch;