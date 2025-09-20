import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'

interface AppButtonProps {
  title: string;
  onPress?: () => void;
}

const AppButton: FC<AppButtonProps> = ({
  title,
  onPress
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={styles.buttonContainer}
    >
      <Text>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default AppButton

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dad857ff',
    borderRadius: 12,
  },
  title: {
    color: 'black',
    fontSize: 15
  }
})