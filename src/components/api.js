import { doc, getDoc } from "firebase/firestore";
import { firestore } from './firebase.js'

export const getProduct = async(id) => {
    const docRef = doc(firestore, `Products/${id}`);
    const productDoc = await getDoc(docRef);
    if(productDoc.exists()){
        const product = productDoc.data();
        return {id, name: product.name, price: product.price};
    }
}