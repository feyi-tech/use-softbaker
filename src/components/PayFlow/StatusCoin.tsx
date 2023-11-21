import React from "react";
import { Box } from "@chakra-ui/react";
import { FaCheck, FaClock, FaTimesCircle } from 'react-icons/fa';

interface StatusCoinProps {
  status?: "success" | "timeout" | "error";
}

const StatusCoin: React.FC<StatusCoinProps> = ({ status }) => {
  const colors = {
    success: {
      bgGradient: "linear(to-r, #3AAFA9, #0F7173)",
      icon: <FaCheck color="#efefef" size="100px" />,
    },
    timeout: {
      bgGradient: "linear(to-r, #D64933, #A61D14)",
      icon: <FaClock color="#efefef" size="100px" />,
    },
    error: {
      bgGradient: "linear(to-r, #D64933, #A61D14)",
      icon: <FaTimesCircle color="#efefef" size="100px" />,
    },
  }

  const color = colors[status || "success"];

  return (
    <Box
      w="150px"
      h="150px"
      borderRadius="50%"
      boxShadow="xl"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient={color.bgGradient}
    >
      {color.icon}
    </Box>
  );
};

export default StatusCoin;