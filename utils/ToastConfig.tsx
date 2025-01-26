import { useColorScheme } from 'react-native';
import { BaseToast, ErrorToast, InfoToast, BaseToastProps } from 'react-native-toast-message';

// Helper function to get theme styles
const getToastTheme = (isDarkTheme: boolean) => ({
  backgroundColor: isDarkTheme ? '#333' : '#fff',
  textColor: isDarkTheme ? '#fff' : '#000',
  borderLeftColorSuccess: 'green',
  borderLeftColorError: 'red',
  borderLeftColorInfo: 'orange',
});

const ToastConfig = () => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const theme = getToastTheme(isDarkTheme);

  return {
    success: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme.borderLeftColorSuccess,
          backgroundColor: theme.backgroundColor,
        }}
        text1Style={{
          fontSize: 17,
          fontWeight: '400',
          color: theme.textColor,
        }}
        text2Style={{
          fontSize: 15,
          color: theme.textColor,
        }}
      />
    ),
    error: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: theme.borderLeftColorError,
          backgroundColor: theme.backgroundColor,
        }}
        text1Style={{
          fontSize: 17,
          color: theme.textColor,
        }}
        text2Style={{
          fontSize: 15,
          color: theme.textColor,
        }}
      />
    ),
    info: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
      <InfoToast
        {...props}
        style={{
          borderLeftColor: theme.borderLeftColorInfo,
          backgroundColor: theme.backgroundColor,
        }}
        text1Style={{
          fontSize: 17,
          color: theme.textColor,
        }}
        text2Style={{
          fontSize: 15,
          color: theme.textColor,
        }}
      />
    ),
  };
};

export default ToastConfig;
