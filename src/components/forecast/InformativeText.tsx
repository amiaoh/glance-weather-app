import { Text, TextProps } from '@chakra-ui/react';

export function InformativeText ({...props}:TextProps) {
  return (
    <Text
        fontSize="xs"
        color="var(--ink3)"
        padding="md"
        {...props}>
            {props.children}
    </Text>
  );
}
