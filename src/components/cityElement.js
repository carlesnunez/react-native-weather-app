import React from 'react';
import { Button } from 'react-native';
import styles from '../styles';

export default ({ cityInfo, onPress }) => (
    <Button color='#007aff' onPress={() => onPress(cityInfo)} title={`${cityInfo.LocalizedName} [${cityInfo.Country.ID}] `} />
);
