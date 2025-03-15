import { getCompanies } from '../../../lib/companies';

async function testCompaniesLoading() {
  try {
    console.log('Starting companies loading test...');
    const companies = await getCompanies();
    console.log('Loaded companies:', companies);
    return companies;
  } catch (error) {
    console.error('Error loading companies:', error);
    throw error;
  }
}

testCompaniesLoading(); 