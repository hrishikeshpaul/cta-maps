import { FunctionComponent } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import { Box, Icon, Flex, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';

interface Props {
    status: 'error' | 'success' | 'info' | 'warning';
    description: string;
}

const StatusToColorMapper = {
    error: 'red.500',
    warning: 'orange.500',
    info: 'blue.500',
    success: 'emerald.500',
};

const StatusToIconMapper: Record<string, any> = {
    success: <MaterialIcons name="check-circle" size={24} color="white" />,
};

export const Toast: FunctionComponent<Props> = ({ description, status }) => {
    return (
        <Box bg={StatusToColorMapper[status]} p="2" rounded="md" w="80%">
            <View style={styles.flex}>
                {StatusToIconMapper[status]}
                <Text pl="4" color="white">
                    {description}
                </Text>
            </View>
        </Box>
    );
};

const styles = StyleSheet.create({
    flex: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
});
