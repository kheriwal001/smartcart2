import React from 'react';

const AddProduct = () => {
    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [company, setCompany] = React.useState('');
    const [error, setError] = React.useState(false);

    const addProduct = async () => {

        console.warn(!name);
        if (!name || !price || !category || !company) {
            setError(true);
            return false;
        }

        const userId = JSON.parse(localStorage.getItem('user'))._id;
        let result = await fetch('http://localhost:5000/add-product', {
            method: 'post',
            body: JSON.stringify({ name, price, category, company, userId }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        result = await result.json();
        console.warn(result);
    }
    return (
        <div className="product" >
            <h1>Add Product</h1>
            <input className='input-box' type="text" placeholder='Enter Product name..' value={name} onChange={(e) => { setName(e.target.value) }} 
            />
            {error && !name && <span className='invalid-input'>Enter Valid name</span>}

            <input className='input-box' type="text" placeholder='Enter Product price..' value={price} onChange={(e) => { setPrice(e.target.value) }} />
            {error && !price && <span className='invalid-input'>Enter Valid price</span>}

            <input className='input-box' type="text" placeholder='Enter Product category..' value={category} onChange={(e) => { setCategory(e.target.value) }} />
            {error && !category && <span className='invalid-input'>Enter Valid category</span>}

            <input className='input-box' type="text" placeholder='Enter Product company..' value={company} onChange={(e) => { setCompany(e.target.value) }} />
            {error && !company && <span className='invalid-input'>Enter Valid company</span>}

            <button onClick={addProduct} className='appButton'>Add Product
            </button>
        </div>
    )
}

export default AddProduct;