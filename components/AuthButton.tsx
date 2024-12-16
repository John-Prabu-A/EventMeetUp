import { Pressable, Text, useColorScheme } from 'react-native';
import { forwardRef } from 'react';
import Colors from '~/constants/Colors';
import { View } from 'react-native-reanimated/lib/typescript/Animated';

type ButtonProps = {
  text: string;
} & React.ComponentPropsWithoutRef<typeof Pressable>;

const Button = forwardRef<View | null, ButtonProps>(({ text, ...pressableProps }, ref) => {
  const colorScheme = useColorScheme();

  const backgroundColor = colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint;
  const textColor = colorScheme === 'dark' ? '#000' : '#fff';

  return (
    <Pressable
      ref={ref}
      {...pressableProps}
      className={`my-2 items-center rounded-full p-4`}
      style={{ backgroundColor }}>
      <Text className="text-lg font-semibold" style={{ color: textColor }}>
        {text}
      </Text>
    </Pressable>
  );
});

export default Button;
