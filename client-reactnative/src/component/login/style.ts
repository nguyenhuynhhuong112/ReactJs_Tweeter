import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
    loginContainer:{
        width: 320,
        height: 360,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 10,
        backgroundColor:'#FFFF',
        justifyContent:'center',
        alignItems:'center',
        shadowColor:'#D9D9D9',
        shadowOffset:{width:3, height:10},
        shadowRadius:10,
    },
    logoLogin:{
        width: 71,
        height:58,
        alignSelf:'flex-start'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    text:{
        textTransform:'uppercase',
        color:'#FFFFFF'
    },
    textInput:{
        backgroundColor:'#FFFF',
        borderWidth:1,
        borderColor:'#DDDDDD',
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        width:250,
        height:41
    },
    conatinerInput:{
        paddingBottom:15,
    },
    buttonLogin:{
        backgroundColor:'#3B82F6',
        justifyContent:'center',
        alignItems:'center',
        width:250,
        height:41,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
    },
    buttonSignup:{
        backgroundColor:'#FF0000',
        justifyContent:'center',
        alignItems:'center',
        width:250,
        height:41,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
    }
})