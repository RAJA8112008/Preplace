const { makeEx } = require("./dsa_emit.cjs");

const note = {
  title: "Matrices / 2D arrays",
  body: "A matrix is an array of rows. matrix[r][c] is row r, column c. An n by n square has a main diagonal r === c and an anti-diagonal r + c === n - 1. Rotate, spiral, and set-zeroes all walk layers or use the first row and column as extra flags. Bound-check every neighbor. In-place rotate overwrites cells, so save a temp (or rotate a 4-cycle) before you write."
};

const example = makeEx(
  "Rotate image (transpose, then reverse each row)",
  "What this is\nA 90 degree clockwise rotate of a square matrix.\nTranspose flips over the main diagonal. Then each row reversed is the rotate.\n\nWhat the code is doing\nThe first nested loop swaps matrix[i][j] with matrix[j][i] for j > i.\nThe second loop reverses each row in place with two pointers.\n[[1,2,3],[4,5,6],[7,8,9]] becomes [[7,4,1],[8,5,2],[9,6,3]].\n\nWatch out\nCounter-clockwise is transpose then reverse columns, or reverse rows then transpose.\nDo not use an extra matrix if the interview asks for in-place.",
  {
    javascript: `function rotate(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const t = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = t;
    }
  }
  for (let i = 0; i < n; i++) {
    let L = 0, R = n - 1;
    while (L < R) {
      const t = matrix[i][L];
      matrix[i][L] = matrix[i][R];
      matrix[i][R] = t;
      L++;
      R--;
    }
  }
  return matrix;
}

console.log(rotate([[1, 2, 3], [4, 5, 6], [7, 8, 9]]));`,
    python: `def rotate(matrix):
  n = len(matrix)
  for i in range(n):
    for j in range(i + 1, n):
      matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
  for i in range(n):
    L, R = 0, n - 1
    while L < R:
      matrix[i][L], matrix[i][R] = matrix[i][R], matrix[i][L]
      L += 1
      R -= 1
  return matrix

print(rotate([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))`,
    java: `class Solution {
  public void rotate(int[][] matrix) {
    int n = matrix.length;
    for (int i = 0; i < n; i++) {
      for (int j = i + 1; j < n; j++) {
        int t = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = t;
      }
    }
    for (int i = 0; i < n; i++) {
      int L = 0, R = n - 1;
      while (L < R) {
        int t = matrix[i][L];
        matrix[i][L] = matrix[i][R];
        matrix[i][R] = t;
        L++; R--;
      }
    }
  }
}`,
    cpp: `void rotate(vector<vector<int>>& matrix) {
  int n = (int)matrix.size();
  for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++) swap(matrix[i][j], matrix[j][i]);
  for (int i = 0; i < n; i++) {
    int L = 0, R = n - 1;
    while (L < R) { swap(matrix[i][L], matrix[i][R]); L++; R--; }
  }
}`,
    c: `void rotate(int n, int matrix[][16]) {
  int i, j, L, R, t;
  for (i = 0; i < n; i++)
    for (j = i + 1; j < n; j++) {
      t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t;
    }
  for (i = 0; i < n; i++) {
    L = 0; R = n - 1;
    while (L < R) {
      t = matrix[i][L]; matrix[i][L] = matrix[i][R]; matrix[i][R] = t;
      L++; R--;
    }
  }
}`
  }
);

module.exports = { note, example };
