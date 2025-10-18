const test = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/admin/import-faculty', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

test();