import React, { useState } from "react";
import { Container, VStack, Text, Input, Button, Image, Box } from "@chakra-ui/react";
import Draggable from "react-draggable";

const Index = () => {
  const [image, setImage] = useState(null);
  const [labels, setLabels] = useState([]);
  const [labelText, setLabelText] = useState("");
  const [currentLabel, setCurrentLabel] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setCurrentLabel({ x, y });
  };

  const handleAddLabel = () => {
    if (currentLabel && labelText) {
      setLabels([...labels, { ...currentLabel, text: labelText }]);
      setLabelText("");
      setCurrentLabel(null);
    }
  };

  const handleStop = (e, data, index) => {
    const newLabels = [...labels];
    newLabels[index] = { ...newLabels[index], x: data.x, y: data.y };
    setLabels(newLabels);
  };

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Upload Floor Plan</Text>
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        {image && (
          <Box position="relative" width="100%" onClick={handleImageClick}>
            <Image src={image} alt="Floor Plan" width="100%" />
            {labels.map((label, index) => (
              <Draggable
                key={index}
                defaultPosition={{ x: label.x, y: label.y }}
                onStop={(e, data) => handleStop(e, data, index)}
              >
                <Text
                  position="absolute"
                  bg="white"
                  px={2}
                  py={1}
                  borderRadius="md"
                  boxShadow="md"
                  cursor="move"
                  style={{ transform: `translate(${label.x}px, ${label.y}px)` }}
                >
                  {label.text}
                </Text>
              </Draggable>
            ))}
          </Box>
        )}
        {currentLabel && (
          <VStack spacing={2} width="100%">
            <Input
              placeholder="Label text"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
            />
            <Button onClick={handleAddLabel}>Add Label</Button>
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default Index;