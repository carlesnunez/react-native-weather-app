export default {
    rootView: {alignItems: 'center', marginTop: 150},
    sun: {tintColor: '#ffff00'},
    moon: {tintColor: '#ffff00'},
    rain: {
        rootView: {flexDirection: 'row'},
        odd: {tintColor: '#d3e4ff', marginTop: 10, transform: [{ rotate: '30deg'},  {scale: 0.7}]},
        even: {tintColor: '#d3e4ff', transform: [{ rotate: '30deg'},  {scale: 0.7}]}
    },
    snow: {
        rootView: {marginTop: -20, marginLeft: 100, transform: [{ scale: 0.8 }]}
    }
}
