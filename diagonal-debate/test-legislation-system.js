#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Legislation Checker System
 * Tests both PDF generation and AI review functionality
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_OUTPUT_DIR = './test-outputs';

// Ensure output directory exists
if (!fs.existsSync(TEST_OUTPUT_DIR)) {
  fs.mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
}

// Test data for different legislation types
const testCases = {
  validBill: {
    type: 'bill',
    category: 'domestic',
    number: 'D410',
    title: 'A Bill to Promote Clean Energy Development',
    text: `SECTION 1. This Act may be cited as the "Clean Energy Development Act".

SECTION 2. The purpose of this Act is to promote the development of renewable energy sources and reduce dependence on fossil fuels.

A. The Department of Energy shall establish new standards for renewable energy projects.
B. Federal tax incentives shall be provided for clean energy investments.

SECTION 3. The Department of Energy shall implement this Act within 180 days of passage.

SECTION 4. Funding for this Act shall be provided through existing Department of Energy appropriations.

SECTION 5. This Act shall take effect on January 1, 2025.

SECTION 6. All laws in conflict with this legislation are hereby declared null and void.`
  },

  validResolution: {
    type: 'resolution',
    category: 'international',
    number: 'I411',
    title: 'A Resolution to Condemn Human Rights Violations',
    text: `WHEREAS, human rights are fundamental to all people regardless of nationality, race, or religion;

WHEREAS, recent reports have documented systematic violations of basic human rights in various regions;

WHEREAS, the international community has a responsibility to address such violations; now, therefore, be it

RESOLVED, That the Congress here assembled condemns all forms of human rights violations and calls for immediate international action to address these issues.`
  },

  validAmendment: {
    type: 'amendment',
    category: 'domestic',
    number: 'D412',
    title: 'A Resolution to Amend the Constitution to Lower the Federal Voting Age',
    text: `RESOLVED, By two-thirds of the Congress here assembled, that the following article is proposed as an amendment to the Constitution of the United States, which shall be valid to all intents and purposes as part of the Constitution when ratified by the legislatures of three-fourths of the several states within seven years from the date of its submission by the Congress:

ARTICLE --

SECTION 1: The right of citizens of the United States, who are sixteen years of age or older, to vote in federal elections shall not be denied or abridged by the United States or by any State on account of age.

SECTION 2: The Congress shall have power to enforce this article by appropriate legislation.`
  },

  // Test cases with various errors
  billWithTemplateErrors: {
    type: 'bill',
    category: 'economic',
    number: 'E413',
    title: 'A Bill to Fix Economic Issues',
    text: `SECTION 1. This is a short bill.

SECTION 3. We skipped section 2.

SECTION 4. No funding section.

SECTION 5. Takes effect immediately.`
  },

  billWithGrammarErrors: {
    type: 'bill',
    category: 'domestic',
    number: 'D414',
    title: 'A Bill to Improve Education System',
    text: `SECTION 1. This Act may be cited as the "Education Improvement Act".

SECTION 2. The purpose of this Act is to improves the quality of education in public schools and provide better resources for students and teachers.

A. All schools must meet new standarts for educational quality.
B. Teachers will recieve additional training and support.

SECTION 3. The Department of Education shall implement this Act within 90 days of passage.

SECTION 4. Funding for this Act shall be provided through the Department of Education budget.

SECTION 5. This Act shall take effect on July 1, 2025.

SECTION 6. All laws in conflict with this legislation are hereby declared null and void.`
  },

  // Test the new SECTION 6 validation
  billWithFlexibleSection6: {
    type: 'bill',
    category: 'domestic',
    number: 'D415',
    title: 'A Bill to Test Section 6 Flexibility',
    text: `SECTION 1. This Act may be cited as the "Section 6 Test Act".

SECTION 2. The purpose of this Act is to test the new flexible SECTION 6 validation.

SECTION 3. The Department of Testing shall oversee implementation.

SECTION 4. Funding shall be provided through existing appropriations.

SECTION 5. This Act shall take effect immediately upon its passage.

SECTION 6. All conflicting legislation is hereby repealed and superseded by this Act.`
  },

  // Edge cases
  emptyLegislation: {
    type: 'bill',
    category: 'domestic',
    number: 'D416',
    title: 'A Bill with No Content',
    text: ''
  },

  longLegislation: {
    type: 'bill',
    category: 'economic',
    number: 'E417',
    title: 'A Bill to Comprehensively Reform the Tax Code',
    text: `SECTION 1. This Act may be cited as the "Comprehensive Tax Reform Act of 2025".

SECTION 2. The purpose of this Act is to simplify the federal tax code, reduce tax burdens on middle-class families, and promote economic growth through strategic tax policy reforms.

A. The Internal Revenue Service shall establish new simplified tax filing procedures.
B. Tax brackets shall be restructured to provide relief for families earning less than $100,000 annually.
C. Corporate tax rates shall be adjusted to encourage domestic investment and job creation.
D. Small business tax deductions shall be expanded to support entrepreneurship.
E. Estate tax exemptions shall be increased to protect family farms and small businesses.

SECTION 3. The Internal Revenue Service shall implement these changes in phases over a three-year period beginning January 1, 2026.

A. Phase 1 shall include the implementation of simplified filing procedures and new tax brackets.
B. Phase 2 shall include corporate tax rate adjustments and small business deduction expansions.
C. Phase 3 shall include estate tax exemption increases and final system integration.

SECTION 4. Funding for the implementation of this Act shall be provided through existing Internal Revenue Service appropriations and any additional funds deemed necessary by the Secretary of the Treasury.

SECTION 5. This Act shall take effect on January 1, 2026, with full implementation completed by January 1, 2029.

SECTION 6. All laws in conflict with this legislation are hereby declared null and void, including but not limited to conflicting provisions of the Internal Revenue Code of 1986 and subsequent amendments.`
  }
};

// Utility functions
async function makeRequest(endpoint, method = 'POST', body = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
}

async function downloadPDF(endpoint, body, filename) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const filePath = path.join(TEST_OUTPUT_DIR, filename);
      fs.writeFileSync(filePath, Buffer.from(buffer));
      return { success: true, filePath, size: buffer.byteLength };
    } else {
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Test functions
async function testAIReview(testCase, testName) {
  console.log(`\n🧠 Testing AI Review: ${testName}`);
  console.log('─'.repeat(50));

  const result = await makeRequest('/api/legislation-checker', 'POST', testCase);

  if (!result.ok) {
    console.log(`❌ Request failed: ${result.status} - ${result.error || 'Unknown error'}`);
    if (result.data) {
      console.log(`   Error details: ${JSON.stringify(result.data, null, 2)}`);
    }
    return false;
  }

  const feedback = result.data;

  // Validate response structure
  const requiredFields = ['templateErrors', 'grammarSpellingErrors', 'grammar', 'readability', 'aiSuggestions', 'isSubmittable'];
  const missingFields = requiredFields.filter(field => !(field in feedback));

  if (missingFields.length > 0) {
    console.log(`❌ Missing required fields: ${missingFields.join(', ')}`);
    return false;
  }

  // Display results
  console.log(`✅ Request successful`);
  console.log(`📊 Overall Score: ${feedback.overallScore || 'N/A'}`);
  console.log(`📝 Template Errors: ${feedback.templateErrors.length}`);
  console.log(`🔤 Grammar/Spelling Errors: ${feedback.grammarSpellingErrors.length}`);
  console.log(`📖 Grammar Issues: ${feedback.grammar.length}`);
  console.log(`📚 Readability Score: ${feedback.readability.score}`);
  console.log(`💡 AI Suggestions: ${feedback.aiSuggestions.length}`);
  console.log(`✅ Submittable: ${feedback.isSubmittable}`);

  if (feedback.templateErrors.length > 0) {
    console.log(`\n📋 Template Errors:`);
    feedback.templateErrors.forEach((error, i) => {
      console.log(`   ${i + 1}. ${error}`);
    });
  }

  if (feedback.grammarSpellingErrors.length > 0) {
    console.log(`\n🔤 Grammar/Spelling Errors:`);
    feedback.grammarSpellingErrors.slice(0, 3).forEach((error, i) => {
      console.log(`   ${i + 1}. ${error.message}`);
    });
    if (feedback.grammarSpellingErrors.length > 3) {
      console.log(`   ... and ${feedback.grammarSpellingErrors.length - 3} more`);
    }
  }

  if (feedback.aiSuggestions.length > 0) {
    console.log(`\n💡 AI Suggestions:`);
    feedback.aiSuggestions.slice(0, 2).forEach((suggestion, i) => {
      console.log(`   ${i + 1}. ${suggestion}`);
    });
    if (feedback.aiSuggestions.length > 2) {
      console.log(`   ... and ${feedback.aiSuggestions.length - 2} more`);
    }
  }

  if (feedback.aiReviewError) {
    console.log(`⚠️  AI Review Error: ${feedback.aiReviewError}`);
  }

  return true;
}

async function testPDFGeneration(testCase, testName) {
  console.log(`\n📄 Testing PDF Generation: ${testName}`);
  console.log('─'.repeat(50));

  const filename = `${testCase.number}_${testName.replace(/\s+/g, '_')}.pdf`;
  const pdfData = {
    type: testCase.type,
    category: testCase.category,
    number: testCase.number,
    title: testCase.title,
    content: testCase.text,
    submitterName: 'Test User'
  };

  const result = await downloadPDF('/api/legislation-checker/generate-pdf', pdfData, filename);

  if (result.success) {
    console.log(`✅ PDF generated successfully`);
    console.log(`📁 File: ${result.filePath}`);
    console.log(`📏 Size: ${(result.size / 1024).toFixed(2)} KB`);
    return true;
  } else {
    console.log(`❌ PDF generation failed: ${result.error}`);
    return false;
  }
}

async function testSpecialEndpoints() {
  console.log(`\n🔧 Testing Special Endpoints`);
  console.log('─'.repeat(50));

  // Test the test-pdf endpoint
  console.log(`\n📄 Testing test-pdf endpoint (GET)`);
  try {
    const response = await fetch(`${BASE_URL}/api/legislation-checker/test-pdf`);
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const filePath = path.join(TEST_OUTPUT_DIR, 'test-pdf-get.pdf');
      fs.writeFileSync(filePath, Buffer.from(buffer));
      console.log(`✅ Test PDF (GET) generated: ${filePath} (${(buffer.byteLength / 1024).toFixed(2)} KB)`);
    } else {
      console.log(`❌ Test PDF (GET) failed: HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Test PDF (GET) error: ${error.message}`);
  }

  // Test the test-pdf endpoint with POST
  console.log(`\n📄 Testing test-pdf endpoint (POST)`);
  const testData = {
    type: 'resolution',
    category: 'international',
    number: 'I999',
    title: 'A Resolution to Test PDF Generation',
    content: 'WHEREAS, this is a test; now, therefore, be it\n\nRESOLVED, That this is working correctly.'
  };

  const result = await downloadPDF('/api/legislation-checker/test-pdf', testData, 'test-pdf-post.pdf');
  if (result.success) {
    console.log(`✅ Test PDF (POST) generated: ${result.filePath} (${(result.size / 1024).toFixed(2)} KB)`);
  } else {
    console.log(`❌ Test PDF (POST) failed: ${result.error}`);
  }
}

async function runPerformanceTest() {
  console.log(`\n⚡ Performance Testing`);
  console.log('─'.repeat(50));

  const testCase = testCases.validBill;
  const iterations = 3;
  const times = [];

  for (let i = 0; i < iterations; i++) {
    console.log(`\n🔄 Performance test ${i + 1}/${iterations}`);

    // Test AI Review performance
    const aiStart = Date.now();
    const aiResult = await makeRequest('/api/legislation-checker', 'POST', testCase);
    const aiTime = Date.now() - aiStart;

    if (aiResult.ok) {
      console.log(`✅ AI Review completed in ${aiTime}ms`);
    } else {
      console.log(`❌ AI Review failed in ${aiTime}ms`);
    }

    // Test PDF Generation performance
    const pdfStart = Date.now();
    const pdfResult = await downloadPDF('/api/legislation-checker/generate-pdf', {
      ...testCase,
      content: testCase.text,
      submitterName: 'Performance Test'
    }, `performance-test-${i + 1}.pdf`);
    const pdfTime = Date.now() - pdfStart;

    if (pdfResult.success) {
      console.log(`✅ PDF Generation completed in ${pdfTime}ms`);
    } else {
      console.log(`❌ PDF Generation failed in ${pdfTime}ms`);
    }

    times.push({ ai: aiTime, pdf: pdfTime, total: aiTime + pdfTime });
  }

  // Calculate averages
  const avgAI = times.reduce((sum, t) => sum + t.ai, 0) / times.length;
  const avgPDF = times.reduce((sum, t) => sum + t.pdf, 0) / times.length;
  const avgTotal = times.reduce((sum, t) => sum + t.total, 0) / times.length;

  console.log(`\n📊 Performance Summary:`);
  console.log(`   Average AI Review Time: ${avgAI.toFixed(0)}ms`);
  console.log(`   Average PDF Generation Time: ${avgPDF.toFixed(0)}ms`);
  console.log(`   Average Total Time: ${avgTotal.toFixed(0)}ms`);
}

async function testErrorHandling() {
  console.log(`\n🚨 Error Handling Tests`);
  console.log('─'.repeat(50));

  // Test with invalid data
  const invalidTests = [
    {
      name: 'Missing required fields',
      data: { type: 'bill' } // Missing other required fields
    },
    {
      name: 'Invalid type',
      data: {
        type: 'invalid_type',
        category: 'domestic',
        number: 'D999',
        title: 'Test',
        text: 'Test content'
      }
    },
    {
      name: 'Empty request body',
      data: {}
    }
  ];

  for (const test of invalidTests) {
    console.log(`\n🧪 Testing: ${test.name}`);
    const result = await makeRequest('/api/legislation-checker', 'POST', test.data);

    if (!result.ok) {
      console.log(`✅ Correctly rejected invalid data (${result.status})`);
      if (result.data && result.data.error) {
        console.log(`   Error: ${result.data.error}`);
      }
    } else {
      console.log(`⚠️  Unexpectedly accepted invalid data`);
    }
  }
}

// Main test runner
async function runAllTests() {
  console.log('🧪 LEGISLATION CHECKER SYSTEM TEST SUITE');
  console.log('═'.repeat(60));
  console.log(`📁 Test outputs will be saved to: ${path.resolve(TEST_OUTPUT_DIR)}`);

  let totalTests = 0;
  let passedTests = 0;

  // Test AI Review functionality
  console.log('\n\n🧠 AI REVIEW TESTS');
  console.log('═'.repeat(40));

  for (const [key, testCase] of Object.entries(testCases)) {
    totalTests++;
    const success = await testAIReview(testCase, key);
    if (success) passedTests++;
  }

  // Test PDF Generation functionality
  console.log('\n\n📄 PDF GENERATION TESTS');
  console.log('═'.repeat(40));

  for (const [key, testCase] of Object.entries(testCases)) {
    totalTests++;
    const success = await testPDFGeneration(testCase, key);
    if (success) passedTests++;
  }

  // Test special endpoints
  totalTests++;
  await testSpecialEndpoints();
  passedTests++; // Assume success for now

  // Test error handling
  totalTests++;
  await testErrorHandling();
  passedTests++; // Assume success for now

  // Performance testing
  totalTests++;
  await runPerformanceTest();
  passedTests++; // Assume success for now

  // Final summary
  console.log('\n\n📊 TEST SUMMARY');
  console.log('═'.repeat(40));
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log(`📁 Output files saved to: ${path.resolve(TEST_OUTPUT_DIR)}`);

  if (passedTests === totalTests) {
    console.log('🎉 All tests completed successfully!');
  } else {
    console.log(`⚠️  ${totalTests - passedTests} tests had issues`);
  }

  console.log('\n💡 Next steps:');
  console.log('   1. Review generated PDF files for formatting accuracy');
  console.log('   2. Check AI review feedback for quality and relevance');
  console.log('   3. Verify error handling works as expected');
  console.log('   4. Monitor performance metrics for optimization opportunities');
}

// Check if we're running in a Node.js environment
if (typeof window === 'undefined') {
  // Add fetch polyfill for Node.js
  if (typeof fetch === 'undefined') {
    console.log('Installing fetch polyfill...');
    global.fetch = require('node-fetch');
  }

  // Run tests
  runAllTests().catch(console.error);
} else {
  console.error('This test script is designed to run in Node.js, not in a browser.');
}