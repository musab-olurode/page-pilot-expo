import {View} from 'react-native';
import React from 'react';
import {Icon, useTheme} from 'react-native-paper';

const StarRating = ({
  size,
  rating,
  class: className,
}: {
  size?: number;
  rating: number;
  class?: string;
}) => {
  const theme = useTheme();
  return (
    <View className={`flex flex-row gap-x-2 ${className || ''}`}>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <Icon
            key={`rating-${index}`}
            source={
              rating > index + 0.5
                ? 'star'
                : rating > index
                ? 'star-half'
                : 'star-outline'
            }
            size={size || 20}
            color={theme.colors.secondary}
          />
        ))}
    </View>
  );
};

export default StarRating;
