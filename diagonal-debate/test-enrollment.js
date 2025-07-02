// Simple test script to check enrollment API
async function testEnrollment() {
  try {
    // Test GET enrollment for a lesson
    console.log('Testing GET enrollment...');
    const getResponse = await fetch('http://localhost:3000/api/lessons/General%20Overview%20%2B%20Schedule%20\'til%20WACFL%201.pdf/enrollment');
    console.log('GET Response status:', getResponse.status);
    const getData = await getResponse.json();
    console.log('GET Response data:', getData);

    // Test POST enrollment (this will fail without auth, but let's see the error)
    console.log('\nTesting POST enrollment...');
    const postResponse = await fetch('http://localhost:3000/api/lessons/General%20Overview%20%2B%20Schedule%20\'til%20WACFL%201.pdf/enrollment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('POST Response status:', postResponse.status);
    const postData = await postResponse.json();
    console.log('POST Response data:', postData);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEnrollment(); 