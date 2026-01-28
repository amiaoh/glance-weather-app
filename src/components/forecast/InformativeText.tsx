import { Text, TextProps } from '@chakra-ui/react';

export function InformativeText ({...props}:TextProps) {
  return (
    <Text
        fontSize="xs"
        color="var(--text-muted)"
        padding="md"
        {...props}>
            {props.children}
    </Text>
  );
}
