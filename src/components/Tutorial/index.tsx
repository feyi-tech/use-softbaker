import React, { useEffect, useState } from 'react';
import { AspectRatio, useBreakpoint } from '@chakra-ui/react';
import { Tool } from '../PayFlow/types';
import { Theme } from '../../theme.type';
import { LIGHT_THEME } from '../SoftBakerProvider';
import { Box, Divider, Flex, HStack, Text } from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import PleaseWaitForX from '../widgets/PleaseWaitForX';
import Poster from './usePoster';
import usePoster from './usePoster';

interface Tutorial {
  show: boolean;
  currentTool?: Tool | null;
  onClose: () => void;
  theme?: Theme | null;
}

const Tutorial: React.FC<Tutorial> = ({ show, currentTool, theme, onClose }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(LIGHT_THEME);
  const breakpoint = useBreakpoint();

  /*
  const [ videoSize, setVideoSize ] = useState<{width: number, height: number}>({width: 560, height: 400})
  const poster = usePoster({siteLogoUrl: currentTool?.siteLogoUrl, noisyWidth: videoSize.width, noisyHeight: videoSize.height})

  useEffect(() => {
    if(breakpoint === 'base') {
        setVideoSize({width: 560, height: 400})

    } else {
        setVideoSize({width: 250, height: 450})
    }
  }, [breakpoint])
  */

  useEffect(() => {
    if (theme) setCurrentTheme(theme);
  }, [theme]);

  if (!show) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      w="100%"
      h="100%"
      bg={currentTheme.overlayBg}
      zIndex="9999"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Flex
        flexDir="column"
        pos="relative"
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          w="100%"
          maxW={{ base: "100%", md: "700px" }}
          h={{ base: "100%", md: "auto" }}
          m="0 auto"
          bg={currentTheme.widgetBg}
          color={currentTheme.widgetColor}
          borderRadius={{ base: "0px", md: "8px" }}
          pb={{ base: "0px" }}
          boxShadow={{ base: "none", md: `0px 0px 10px ${currentTheme.widgetShadow}` }}
          pos="relative"
          pt={{ base: "0.5rem", md: "0px" }}
          overflow="hidden"
        >
          <HStack w="100%" py="0.5rem" px="0.5rem" justifyContent="space-between" alignItems="center">
            <>
              {currentTool ? (
                <Text m="0px !important" py="0px !important" px="0.5rem !important" fontSize="1.2rem" fontWeight="500">
                  {currentTool.name} Video
                </Text>
              ) : (
                <Box></Box>
              )}
              <Box
                p="0.5rem"
                cursor="pointer"
                border="1px solid #e2e8f0"
                _hover={{ opacity: 0.7 }}
                borderRadius="50%"
                onClick={onClose}
              >
                <FaTimes size="10px" />
              </Box>
            </>
          </HStack>

          <Divider mx="0px !important" m="0 !important" />

          {currentTool ? (
            <Flex id="container" flexDir="column" pos="relative" w="100%" minH="560px" p="0" justifyContent="center" alignItems="center">
                <Flex id="loading" flexDir="column" pos="absolute" w="100%" h="100px" m="0.5rem" justifyContent="center" alignItems="center">
                    <PleaseWaitForX />
                </Flex>
                <Flex id="videoview" flexDir="column" pos="absolute" w="100%" minH="300px" m="0.5rem" justifyContent="center" alignItems="center">
                {
                  breakpoint === 'base'?
                  <AspectRatio 
                    w={{base: '200px'}} 
                    h={{base: '400px'}} 
                    ratio={9 / 18}>
                    <Box as="iframe"
                      title={currentTool.name}
                      src={`${currentTool.mobileVideoUrl}?rel=0&enablejsapi=1`}
                      borderRadius="15px"
                      allow="accelerometer; gyroscope; picture-in-picture; fullscreen;"
                    />
                  </AspectRatio>
                  :
                  <AspectRatio 
                    w={{base: '350px', sm: '400px', md: '560px'}} 
                    maxW="95%" 
                    ratio={16 / 9}>
                    <Box as="iframe"
                      title={currentTool.name}
                      src={`${currentTool.desktopVideoUrl}?rel=0&enablejsapi=1`}
                      borderRadius="25px"
                      allow="accelerometer; gyroscope; picture-in-picture; fullscreen;"
                    />
                  </AspectRatio>
                }
                </Flex>
            </Flex>
          ) : (
            <Flex flexDir="column" pos="relative" w="100%" h="100%" justifyContent="center" alignItems="center" p="1rem">
                <PleaseWaitForX />
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Tutorial;

/**
 * 
 */