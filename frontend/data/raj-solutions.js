window.RAJ_SOLUTIONS = {
  "two-sum": {
    q: "Two Sum",
    topic: "dsa-arrays",
    id: 1,
    source: "leetcode",
    folder: "0001-two-sum",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0001-two-sum",
    codes: {
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        //strore the values with there indices 
        vector<pair<int,int>>arr;
        for(int i=0;i<nums.size();i++){
            arr.push_back({nums[i],i});
        }
        //now sort the arr 
        sort(arr.begin(),arr.end());
        int i=0;
        int j=nums.size()-1;
        while(i<j){
            int sum=arr[i].first+arr[j].first;
            if(sum==target){
                return {arr[i].second,arr[j].second};
            }else if(sum>target){
                j--;
            }else{
                i++;
            }
        }
        return {-1,-1};
    }
};`
    }
  },
  "best-time-to-buy-and-sell-stock": {
    q: "Best Time to Buy and Sell Stock",
    topic: "dsa-arrays",
    id: 2,
    source: "leetcode",
    folder: "0121-best-time-to-buy-and-sell-stock",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0121-best-time-to-buy-and-sell-stock",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // cheapest buy so far
        int minprice=prices[0];
        // best sell minus that buy
        int maxprofit=0;
        // walk each index
        for(int i=1;i<prices.size();i++){
           // cheapest buy so far
           minprice=min(minprice,prices[i]);
           // cheapest buy so far
           maxprofit=max(maxprofit,prices[i]-minprice);
        }
        // answer is ready — leave
        return maxprofit;
    }
};`
    }
  },
  "maximum-subarray": {
    q: "Maximum Subarray (Kadane)",
    topic: "dsa-arrays",
    id: 5,
    source: "leetcode",
    folder: "0053-maximum-subarray",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0053-maximum-subarray",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        //brute force 
        // left pointer
        int i=0;
        // name this value so later lines can use it
        int n=nums.size();
        // only do this when the check is true
        if(n==1)return nums[0];
        // name this value so later lines can use it
        int maxsum=INT_MIN;
        // drop the window if the sum went negative
        int sum=0;
        // left pointer
        for(int i=0;i<n;i++){
          // add this number into the running sum
          sum+=nums[i];
           // only do this when the check is true
           if(sum<0){
            // drop the window if the sum went negative
            sum=0;
           }

           maxsum=max(maxsum,sum);
        }
        // answer is ready — leave
        return maxsum==0?*max_element(nums.begin(),nums.end()):maxsum;
    }
};`
    }
  },
  "maximum-product-subarray": {
    q: "Maximum Product Subarray",
    topic: "dsa-arrays",
    id: 6,
    source: "leetcode",
    folder: "0152-maximum-product-subarray",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0152-maximum-product-subarray",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    int maxProduct(vector<int>& nums) {
       // name this value so later lines can use it
       int minans=nums[0];
       // name this value so later lines can use it
       int maxans=nums[0];
       // name this value so later lines can use it
       int ans=nums[0];
       // walk each index
       for(int i=1;i<nums.size();i++){
        // only do this when the check is true
        if(nums[i]<0)swap(minans,maxans);
        maxans=max(nums[i],maxans*nums[i]);
        minans=min(nums[i],minans*nums[i]);
        ans=max(ans,maxans);
       } 
       // answer is ready — leave
       return ans;
    }
};`
    }
  },
  "merge-intervals": {
    q: "Merge Intervals",
    topic: "dsa-arrays",
    id: 7,
    source: "leetcode",
    folder: "0056-merge-intervals",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0056-merge-intervals",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        vector<vector<int>>ans;
        // now sort the arr
        sort(intervals.begin(),intervals.end());
        ans.push_back(intervals[0]);
        // walk each index
        for(int i=1;i<intervals.size();i++){
            // only do this when the check is true
            if(ans.back()[1]>=intervals[i][0]){
                ans.back()[1]=max(ans.back()[1],intervals[i][1]);
            }else{
                ans.push_back(intervals[i]);
            }
        }
        // answer is ready — leave
        return ans;
    }
};`
    }
  },
  "3sum": {
    q: "3Sum",
    topic: "dsa-arrays",
    id: 9,
    source: "leetcode",
    folder: "0015-3sum",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0015-3sum",
    codes: {
      cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        vector<vector<int>>ans;
        //first sort
        int n=nums.size();
        sort(nums.begin(),nums.end());
        for(int i=0;i<n-2;i++){
            //now using two pointer 
            int j=i+1;
            int k=n-1;
            //ignore duplacy here for i 
            if(i>0 && nums[i]==nums[i-1])continue;
            while(j<k){
                int sum=nums[j]+nums[k]+nums[i];
                if(sum==0){
                    ans.push_back({nums[i],nums[j],nums[k]});
                    j++;
                    k--;
                    //ignore duplacy 
                   while(j<k && nums[j]==nums[j-1])j++;
                   while( j<k && nums[k]==nums[k+1])k--;
                }else if(sum<0){
                    j++;
                }else{
                    k--;
                }
            }
        }
        return ans;
    }
};`
    }
  },
  "rotate-array": {
    q: "Rotate Array",
    topic: "dsa-arrays",
    id: 12,
    source: "leetcode",
    folder: "0189-rotate-array",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0189-rotate-array",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        // name this value so later lines can use it
        int n=nums.size();
        vector<int>ans(n);
        // left pointer
        for(int i=0;i<nums.size();i++){
            ans[(i+k)%n]=nums[i];
        }
        nums=ans;
       
    }
};`
    }
  },
  "set-matrix-zeroes": {
    q: "Set Matrix Zeroes",
    topic: "dsa-arrays",
    id: 13,
    source: "leetcode",
    folder: "0073-set-matrix-zeroes",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0073-set-matrix-zeroes",
    codes: {
      cpp: `class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        //first store indexes having zero 
        int n=matrix.size();
        int m=matrix[0].size();
        vector<int>rowstore;
        vector<int>colstore;
        for(int i=0;i<n;i++){
            for(int j=0;j<m;j++){
                if(matrix[i][j]==0){
                    rowstore.push_back(i);
                    colstore.push_back(j);
                }
            }
        }
       //convert row having zero its all elements 
       for(auto row:rowstore){
        for(int i=0;i<m;i++){
            matrix[row][i]=0;
        }
       }

        for(auto col:colstore){
        for(int i=0;i<n;i++){
            matrix[i][col]=0;
        }
       }
       
    }
};`
    }
  },
  "spiral-matrix": {
    q: "Spiral Matrix",
    topic: "dsa-arrays",
    id: 14,
    source: "leetcode",
    folder: "0054-spiral-matrix",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0054-spiral-matrix",
    codes: {
      cpp: `class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
       int row=matrix.size();
       int col=matrix[0].size();
       int firstrow=0;
       int firstcol=0;
       int lastrow=row-1;
       int lastcol=col-1;
       int count=0;
       int total=row*col;
       vector<int>ans;
       while(count<total){
        //first row 
        for(int i=firstcol;i<=lastcol && count<total;i++){
            ans.push_back(matrix[firstrow][i]);
            count++;
        }
        firstrow++;
        //last col 
        for(int i=firstrow;i<=lastrow && count<total;i++){
            ans.push_back(matrix[i][lastcol]);
            count++;
        }
        lastcol--;
        //last row 
        for(int i=lastcol;i>=firstcol && count<total;i--){
            ans.push_back(matrix[lastrow][i]);
            count++;
        }
        lastrow--;
        //first row 
        for(int i=lastrow;i>=firstrow && count<total;i--){
            ans.push_back(matrix[i][firstcol]);
            count++;
        }
        firstcol++;
       }
       return ans;
    }
};`
    }
  },
  "next-permutation": {
    q: "Next Permutation",
    topic: "dsa-arrays",
    id: 15,
    source: "leetcode",
    folder: "0031-next-permutation",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0031-next-permutation",
    codes: {
      cpp: `class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int pivot=-1;
       
        int n=nums.size();
     //store index to get greater elem
        for(int i=n-2;i>=0;i--){
            if(nums[i]<nums[i+1]){
                //store 
                pivot=i;
                break;
            }
        }
        //give first small 
        if(pivot==-1){
         reverse(nums.begin(),nums.end());
         return;
        }
        //swap just greater elem
        for(int i=n-1;i>pivot;i--){
            if(nums[i]>nums[pivot]){
                swap(nums[i],nums[pivot]);
                break;
            }
        }
        //now reverse remaing elem 
        int i=pivot+1;
        int j=n-1;
        while(i<j){
            swap(nums[i],nums[j]);
            i++;
            j--;
        }
    }
};`
    }
  },
  "sort-colors": {
    q: "Sort Colors (Dutch flag)",
    topic: "dsa-arrays",
    id: 16,
    source: "leetcode",
    folder: "0075-sort-colors",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0075-sort-colors",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    void sortColors(vector<int>& nums) {
        // name this value so later lines can use it
        int n=nums.size();
        // left pointer
        for(int i=0;i<n;i++){
            // walk each index
            for(int j=i+1;j<n;j++){
                // only do this when the check is true
                if(nums[i]>nums[j]){
                    swap(nums[i],nums[j]);
                }
            }
        }
    }
};`
    }
  },
  "subarray-sum-equals-k": {
    q: "Subarray Sum Equals K",
    topic: "dsa-arrays",
    id: 18,
    source: "leetcode",
    folder: "0560-subarray-sum-equals-k",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0560-subarray-sum-equals-k",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        // name this value so later lines can use it
        int n=nums.size();
        // name this value so later lines can use it
        int count=0;
        // left pointer
        for(int i=0;i<n;i++){
             // drop the window if the sum went negative
             int sum=0;
            // walk each index
            for(int j=i;j<n;j++){
                // add this number into the running sum
                sum+=nums[j];
                // only do this when the check is true
                if(sum==k){
                    count++;
                }
            }
        }
        // answer is ready — leave
        return count;
    }
};`
    }
  },
  "majority-element": {
    q: "Majority Element",
    topic: "dsa-arrays",
    id: 23,
    source: "leetcode",
    folder: "0169-majority-element",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0169-majority-element",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    int majorityElement(vector<int>& nums) {
        // name this value so later lines can use it
        int count=1;
         // name this value so later lines can use it
         int elem=nums[0];
        // walk each index
        for(int i=1;i<nums.size();i++){
            // only do this when the check is true
            if(elem==nums[i]){
                count++;
            }else{
                count--;
                // only do this when the check is true
                if(count==0){
                    elem=nums[i+1];
                }
            }
        }
        // answer is ready — leave
        return elem;
    }
};`
    }
  },
  "move-zeroes": {
    q: "Move Zeroes",
    topic: "dsa-arrays",
    id: 24,
    source: "leetcode",
    folder: "0283-move-zeroes",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0283-move-zeroes",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        // name this value so later lines can use it
        int k=0;
        // left pointer
        for(int i=0;i<nums.size();i++){
        
            // only do this when the check is true
            if(nums[i]!=0){
                swap(nums[i],nums[k]);
                k++;
            }
        }
        
    }
};`
    }
  },
  "missing-number": {
    q: "Missing Number",
    topic: "dsa-arrays",
    id: 25,
    source: "leetcode",
    folder: "0268-missing-number",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0268-missing-number",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    int missingNumber(vector<int>& nums) {
        // name this value so later lines can use it
        int n=nums.size();
        // name this value so later lines can use it
        int totalsum=n*(n+1)/2;
        // drop the window if the sum went negative
        int sum=0;
        // left pointer
        for(int i=0;i<n;i++){
            // add this number into the running sum
            sum+=nums[i];
        }
        // answer is ready — leave
        return totalsum-sum;
    }
};`
    }
  },
  "4sum": {
    q: "4Sum",
    topic: "dsa-arrays",
    id: 27,
    source: "leetcode",
    folder: "0018-4sum",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0018-4sum",
    codes: {
      cpp: `class Solution {
public:
    vector<vector<int>> fourSum(vector<int>& nums, int target) {
       vector<vector<int>>ans;
       sort(nums.begin(),nums.end());
       int n=nums.size();
       for(int i=0;i<n-3;i++){
        if(i>0 && nums[i]==nums[i-1])continue;
        for(int j=i+1;j<n-2;j++){
            //two pointer proble 
            int k=j+1;
            int l=n-1;
            //remove duplicacy 
            if(j>i+1 && nums[j]==nums[j-1])continue;
            while(k<l){
               long long  sum=1LL*nums[k]+nums[l]+nums[i]+nums[j];
                if(sum==target){
                    ans.push_back({nums[i],nums[j],nums[k],nums[l]});
                    k++;
                    l--;
                    //remove duplicacy 
                    while(k<l &&nums[k]==nums[k-1])k++;
                    while(k<l &&nums[l]==nums[l+1])l--;
                }else if(sum<target){
                    k++;
                }else{
                    l--;
                }
            }
        }
       }
      return ans;

    }
};`
    }
  },
  "pascals-triangle": {
    q: "Pascal's Triangle",
    topic: "dsa-arrays",
    id: 30,
    source: "leetcode",
    folder: "0118-pascals-triangle",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0118-pascals-triangle",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        vector<vector<int>>rows;
        rows.push_back({1});
         // walk each index
         for(int i=1;i<numRows;i++){
            //store n-1 row to create n row 
            vector<int>lastrow=rows.back();
            vector<int>currrow;
             currrow.push_back(1);
            // left pointer
            for(int i=0;i<lastrow.size()-1;i++){
            currrow.push_back({lastrow[i]+lastrow[i+1]});
            }
            currrow.push_back(1);
            rows.push_back({currrow});
         }
    // answer is ready — leave
    return rows;
    }
};`
    }
  },
  "rotate-image": {
    q: "Rotate Image",
    topic: "dsa-arrays",
    id: 33,
    source: "leetcode",
    folder: "0048-rotate-image",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0048-rotate-image",
    codes: {
      cpp: `class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
         //first interchange rows  to col 
         int n=matrix.size();
         for(int i=0;i<n;i++){
            for(int j=i;j<n;j++){
               swap(matrix[i][j],matrix[j][i]);
            }
         }
         //reverse the interchanged values 
         for(int i=0;i<n;i++){
            reverse(matrix[i].begin(),matrix[i].end());
         }
    }
};`
    }
  },
  "binary-search": {
    q: "Binary Search",
    topic: "dsa-binarysearch",
    id: 1,
    source: "leetcode",
    folder: "0704-binary-search",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0704-binary-search",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    int search(vector<int>& nums, int target) {
        // name this value so later lines can use it
        int st=0;
        // name this value so later lines can use it
        int ed=nums.size()-1;
        while(st<=ed){
            // name this value so later lines can use it
            int mid=st+(ed-st)/2;
            // only do this when the check is true
            if(nums[mid]==target){
                // answer is ready — leave
                return mid;
            // only do this when the check is true
            }else if(nums[mid]<target){
                st=mid+1;
            }else{
                ed=mid-1;
            }
        }
        // answer is ready — leave
        return -1;
    }
};`
    }
  },
  "search-insert-position": {
    q: "Search Insert Position",
    topic: "dsa-binarysearch",
    id: 2,
    source: "leetcode",
    folder: "0035-search-insert-position",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0035-search-insert-position",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        // name this value so later lines can use it
        int st=0;
        // name this value so later lines can use it
        int ed=nums.size()-1;
        while(st<=ed){
            // name this value so later lines can use it
            int mid=st+(ed-st)/2;
            // only do this when the check is true
            if(nums[mid]==target){
                // answer is ready — leave
                return mid;
            // only do this when the check is true
            }else if(nums[mid]<target){
                st=mid+1;
            }else{
                ed=mid-1;
            }
        }
        // answer is ready — leave
        return st;
    }
};`
    }
  },
  "find-first-and-last-position-of-element-in-a-sorted-array": {
    q: "Find First and Last Position of Element in Sorted Array",
    topic: "dsa-binarysearch",
    id: 3,
    source: "leetcode",
    folder: "0034-find-first-and-last-position-of-element-in-sorted-array",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0034-find-first-and-last-position-of-element-in-sorted-array",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
int firstOccurence(vector<int>&nums,int target){
    // name this value so later lines can use it
    int st=0;
    // name this value so later lines can use it
    int ed=nums.size()-1;
    // name this value so later lines can use it
    int ans1=-1;
    while(st<=ed){
        // name this value so later lines can use it
        int mid=st+(ed-st)/2;
        // only do this when the check is true
        if(nums[mid]==target){
            ans1=mid;
            ed=mid-1;
        // only do this when the check is true
        }else if(nums[mid]<target){
            st=mid+1;
        }else{
            ed=mid-1;
        }
    }
    // answer is ready — leave
    return ans1;
}

int secondOccurence(vector<int>&nums,int target){
    // name this value so later lines can use it
    int st=0;
    // name this value so later lines can use it
    int ed=nums.size()-1;
    // name this value so later lines can use it
    int ans2=-1;
    while(st<=ed){
        // name this value so later lines can use it
        int mid=st+(ed-st)/2;
        // only do this when the check is true
        if(nums[mid]==target){
            ans2=mid;
           st=mid+1;
        // only do this when the check is true
        }else if(nums[mid]<target){
            st=mid+1;
        }else{
            ed=mid-1;
        }
    }
    // answer is ready — leave
    return ans2;
}
    vector<int> searchRange(vector<int>& nums, int target) {
        // name this value so later lines can use it
        int first=firstOccurence(nums,target);
        // name this value so later lines can use it
        int second=secondOccurence(nums,target);
        // answer is ready — leave
        return {first,second};
    }
};`
    }
  },
  "find-peak-element": {
    q: "Find Peak Element",
    topic: "dsa-binarysearch",
    id: 6,
    source: "leetcode",
    folder: "0162-find-peak-element",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0162-find-peak-element",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        // name this value so later lines can use it
        int st=0;
        // name this value so later lines can use it
        int  ed=nums.size()-1;
        while(st<ed){
            // name this value so later lines can use it
            int mid=st+(ed-st)/2;
            // only do this when the check is true
            if(nums[mid]<nums[mid+1]){
                st=mid+1;
            }else{
                ed=mid;
            }
        }
        // answer is ready — leave
        return ed;
    }
};`
    }
  },
  "climbing-stairs": {
    q: "Climbing Stairs",
    topic: "dsa-dp",
    id: 1,
    source: "leetcode",
    folder: "0070-climbing-stairs",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0070-climbing-stairs",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    int climbStairs(int n) {
        vector<int>dp(n+1);
        dp[0]=1;
        dp[1]=1;
        // walk each index
        for(int i=2;i<=n;i++){
            dp[i]=dp[i-1]+dp[i-2];
        }
        // answer is ready — leave
        return dp[n];
    }
};`
    }
  },
  "house-robber": {
    q: "House Robber",
    topic: "dsa-dp",
    id: 2,
    source: "leetcode",
    folder: "0198-house-robber",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0198-house-robber",
    codes: {
      cpp: `class Solution {
public:
int solve(int i,vector<int>&nums,vector<int>&dp){
    int n=nums.size();
    if(i>=n)return 0;
    if(dp[i]!=-1)return dp[i];
    //include 
    int include=nums[i]+solve(i+2,nums,dp);
    //exclude 
    int exclude=solve(i+1,nums,dp);
    return dp[i]=max(include,exclude);
}
    int rob(vector<int>& nums) {
        int i=0;
        int n=nums.size();
        vector<int>dp(n+1,-1);
        return solve(i,nums,dp);
    }
};`
    }
  },
  "house-robber-ii": {
    q: "House Robber II",
    topic: "dsa-dp",
    id: 3,
    source: "leetcode",
    folder: "0213-house-robber-ii",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0213-house-robber-ii",
    codes: {
      cpp: `class Solution {
public:
int solve(vector<int>&nums,int i,int ed,vector<int>&dp){
    if(i>ed)return 0;
    if(dp[i]!=-1)return dp[i];
    //include 
    int include=nums[i]+solve(nums,i+2,ed,dp);
    //exclude 
    int exclude=solve(nums,i+1,ed,dp);
    return dp[i]= max(include,exclude);
}
    int rob(vector<int>& nums) {
        int n=nums.size();
        vector<int>dp1(n+1,-1);
        vector<int>dp2(n+1,-1);
        //case 1
        if(n==1)return nums[0];
        int ed=solve(nums,1,n-1,dp1);
        int start=solve(nums,0,n-2,dp2);
        //case 2
     
        return max(start,ed);
    }
};`
    }
  },
  "number-of-islands": {
    q: "Number of Islands",
    topic: "dsa-graph",
    id: 1,
    source: "leetcode",
    folder: "0200-number-of-islands",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0200-number-of-islands",
    codes: {
      cpp: `class Solution {
public:
vector<pair<int,int>>directions={{-1,0},{0,-1},{1,0},{0,1}};
 void  dfs(vector<vector<char>>& grid,int i,int j,int n,int m){
    grid[i][j]='0';
  //check directions 
  for(auto dir:directions){
      int ni=dir.first + i;
      int nj=dir.second+j;
      //check boundry 
      if(ni>=0 && nj>=0 &&  ni<n && nj<m && grid[ni][nj]=='1'){
        dfs(grid,ni,nj,n,m);
      }
  }

 }
    int numIslands(vector<vector<char>>& grid) {
        int n=grid.size();
        int m=grid[0].size();
        //DFS 
        int count=0;
        for(int i=0;i<n;i++){
            for(int j=0;j<m;j++){
                if(grid[i][j]=='1'){
                    //dfs
                    dfs(grid,i,j,n,m);
                    count++;
                }
            }
        }
        return count;
    }
};`
    }
  },
  "course-schedule": {
    q: "Detect Cycle in a Directed Graph",
    topic: "dsa-graph",
    id: 18,
    source: "leetcode",
    folder: "0207-course-schedule",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0207-course-schedule",
    codes: {
      cpp: `class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        //if DAG->cycle is present in the Graph then it is not 
        int totalnode=0;
        //Store In Degree 
        vector<int>InDegree(numCourses,0);
        //craete an AdjList 
        unordered_map<int,vector<int>>adj(numCourses);
        for(int i=0;i<prerequisites.size();i++){
            int u=prerequisites[i][0];
            int v=prerequisites[i][1];
            //directed graph
            adj[u].push_back(v);
            //store Indegree
            InDegree[v]++;
        }
        queue<int>q;
        for(int i=0;i<InDegree.size();i++){
            if(InDegree[i]==0){
                q.push(i);
            }
        }
        //pop from the queue
        while(!q.empty()){
            int node=q.front();
             totalnode++;
            q.pop();
            //and traverse its nbr to remove the inDegree
            for(auto nbr:adj[node]){
                //reduce the Indegree 
                InDegree[nbr]--;
                //push nbr if its inDegree in ZERO 
                if(InDegree[nbr]==0){
                    q.push(nbr);
                }
            }
        }
       if(totalnode==numCourses){
        return true;
       }
       return false;
    }
};`
    }
  },
  "number-of-connected-components-in-an-undirected-graph": {
    q: "Number of Connected Components in an Undirected Graph",
    topic: "dsa-graph",
    id: 7,
    source: "gfg",
    folder: "Number of Connected Components",
    repo: "https://github.com/RAJA8112008/gfg-solutions",
    codes: {
      cpp: `class Solution {
  public:
  void dfs(int idx,vector<bool>&visited,unordered_map<int,vector<int>>&adj){
      visited[idx]=true;
      //find its adj 
      for(auto nbr:adj[idx]){
          if(visited[nbr]!=true){
              dfs(nbr,visited,adj);
          }
      }
  }
    int countConnected(int V, vector<vector<int>>& edges) {
       //using DFS 
       //createv an adj list 
       int n=edges.size();
       unordered_map<int,vector<int>>adj(V);
       for(int i=0;i<edges.size();i++){
           int u=edges[i][0];
           int v=edges[i][1];
           //undirected graph 
           adj[u].push_back(v);
           adj[v].push_back(u);
       }
       vector<bool>visited(V,false);
       int count=0;
       //call DFS for each component
        for(int i=0;i<V;i++){
            //dfs call 
            if(visited[i]!=true){
                 dfs(i,visited,adj);
                 count++;
            }
            
        }
        return count;
    }
};`
    }
  },
  "word-ladder": {
    q: "Word Ladder",
    topic: "dsa-graph",
    id: 8,
    source: "leetcode",
    folder: "0127-word-ladder",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0127-word-ladder",
    codes: {
      cpp: `class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        //first store  all words to make them visited
        unordered_map<string,bool>mp;
        //push values in map  and mark them false;
        for(auto val:wordList){
            mp[val]=false;
        }
        //create a queue
        queue<pair<string,int>>q;
        q.push({beginWord,1});
        mp[beginWord]=true;
        //pop values from the queue and apply BFS 
        while(!q.empty()){
            pair<string,int>temp=q.front();
            q.pop();
            string word=temp.first;
            int level=temp.second;
            if(word==endWord)return level;
            //now change its value and find in map
            for(int i=0;i<word.length();i++){
                string wordChange=word;
                for(char c='a';c<='z';c++){
                    //change the word 
                    wordChange[i]=c;
                    //search in map 
                    if(mp.find(wordChange)!=mp.end() && mp[wordChange]==false){
                        //push into queue 
                        q.push({wordChange,level+1});
                        mp[wordChange]=true;
                    }
                    
                }
            }
        }
        return 0;
    }
};`
    }
  },
  "rotting-oranges": {
    q: "Rotting Oranges",
    topic: "dsa-graph",
    id: 9,
    source: "leetcode",
    folder: "0994-rotting-oranges",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0994-rotting-oranges",
    codes: {
      cpp: `class Solution {
public:
vector<pair<int,int>>direction={{0,1},{1,0},{-1,0},{0,-1}};
    int orangesRotting(vector<vector<int>>& grid) {
        //using DFS 
          //count all fresh oranges 
          int freshOrange=0;
          int n=grid.size();
          int m=grid[0].size();
          queue<pair<int,int>>q;
         for(int i=0;i<n;i++){
            for(int j=0;j<m;j++){
                if(grid[i][j]==2){
                    q.push({i,j});
                }else if(grid[i][j]==1){
                    freshOrange++;
                }
            }
         }
      if(freshOrange == 0)
            return 0;
        int time=0;
        int rotton=0;
        while(!q.empty()){
            int size=q.size();
         for(int i=0;i<size;i++){
           auto indexes=q.front();
           q.pop();
           int i_=indexes.first;
           int j_=indexes.second;
           //check validations 
           for(auto dir:direction){
            int ni=i_+dir.first;
            int nj=j_+dir.second;
            //check validations 
            if(ni>=0 && ni<n && nj>=0 && nj<m && grid[ni][nj]==1){
                grid[ni][nj]=2;
                q.push({ni,nj});
                rotton++;
            }
           }
         }
           time++;
        }
        
       return freshOrange==rotton ?time-1:-1;
    }
};`
    }
  },
  "network-delay-time": {
    q: "Network Delay Time",
    topic: "dsa-graph",
    id: 12,
    source: "leetcode",
    folder: "0743-network-delay-time",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0743-network-delay-time",
    codes: {
      cpp: `class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        //create an adj list 
        unordered_map<int,vector<pair<int,int>>>adj;
        for(int i=0;i<times.size();i++){
            int u=times[i][0];
            int v=times[i][1];
            int w=times[i][2];
            //directed map
            adj[u].push_back({v,w});
        }
        //crete a vector which will store min to reach each node 
        vector<int>dist(n+1,INT_MAX);
        //create an priority queue 
        priority_queue<pair<int,int>,vector<pair<int,int>>,greater<pair<int,int>>>q;

        //push into the queue 
        q.push({k,0});
        dist[k]=0;
        while(!q.empty()){
            int node=q.top().first;
            int d=q.top().second;
            q.pop();
            //traverse on its nbr with min d
            for(auto nbr:adj[node]){
                int n_node=nbr.first;
                int n_d=nbr.second;
                if(d+n_d<dist[n_node]){
                    dist[n_node]=d+n_d;
                    q.push({n_node,d+n_d});
                }
            }

        }
        //
       int maxi=0;
       for(int i=1;i<=n;i++){
        if(dist[i]==INT_MAX)return -1;
        maxi=max(maxi,dist[i]);
       }
       return maxi;
    }
};`
    }
  },
  "cheapest-flights-within-k-stops": {
    q: "Cheapest Flights Within K Stops",
    topic: "dsa-graph",
    id: 13,
    source: "leetcode",
    folder: "0787-cheapest-flights-within-k-stops",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0787-cheapest-flights-within-k-stops",
    codes: {
      cpp: `class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {

        // create adjacency list
        unordered_map<int, vector<pair<int, int>>> adj;

        for (int i = 0; i < flights.size(); i++) {
            int u = flights[i][0];
            int v = flights[i][1];
            int w = flights[i][2];

            adj[u].push_back({v, w});
        }

        // dist[i] = minimum cost to reach i
        vector<int> dist(n, INT_MAX);

        // queue -> {node, cost}
        queue<pair<int, int>> q;

        q.push({src, 0});
        dist[src] = 0;

        int stops = 0;

        while (!q.empty() && stops <= k) {

            int size = q.size();

            // copy of dist for this level
            vector<int> temp = dist;

            while (size--) {

                int node = q.front().first;
                int cost = q.front().second;
                q.pop();

                // traverse neighbours
                for (auto nbr : adj[node]) {

                    int nextNode = nbr.first;
                    int price = nbr.second;

                    if (cost + price < temp[nextNode]) {

                        temp[nextNode] = cost + price;

                        q.push({nextNode, temp[nextNode]});
                    }
                }
            }

            dist = temp;
            stops++;
        }

        if (dist[dst] == INT_MAX)
            return -1;

        return dist[dst];
    }
};`
    }
  },
  "flood-fill": {
    q: "Flood Fill",
    topic: "dsa-graph",
    id: 16,
    source: "leetcode",
    folder: "0733-flood-fill",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0733-flood-fill",
    codes: {
      cpp: `class Solution {
public:
vector<pair<int,int>>directions={{1,0},{0,1},{-1,0},{0,-1}};
void dfs(vector<vector<int>>&image,
vector<vector<bool>>&visited,int oldcolor,int newcolor,int n,int m,int i,int j){

    if(i>=0 && i<n && j>=0 && j<m && image[i][j]==oldcolor){
        if(visited[i][j]!=true){
            image[i][j]=newcolor;
             visited[i][j]=true;
               //find directions 
        for(auto dir:directions){
            int ni=dir.first+i;
            int nj=dir.second+j;
            //dfs call 
                 dfs(image,visited,oldcolor,newcolor,n,m,ni,nj);
        }
        }
    }
}
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
    int n=image.size();
    int m=image[0].size();
    int oldcolor=image[sr][sc];
     vector<vector<bool>> visited(n, vector<bool>(m, false));
    dfs(image,visited,oldcolor,color,n,m,sr,sc);
    return image;
    }
};`
    }
  },
  "shortest-path-in-binary-matrix": {
    q: "Shortest Path in Binary Matrix",
    topic: "dsa-graph",
    id: 17,
    source: "leetcode",
    folder: "1091-shortest-path-in-binary-matrix",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/1091-shortest-path-in-binary-matrix",
    codes: {
      cpp: `class Solution {
public:
vector<pair<int,int>> directions = {
    {1,0},    
    {0,1}, 
    {-1,0},  
    {0,-1}, 
    {-1,-1},
    {-1,1},  
    {1,-1}, 
    {1,1}     
};
    int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
        int n=grid.size();
        int m=grid[0].size();
        if(grid[0][0]!=0 || grid[n-1][m-1]!=0)return -1;
      queue<pair<pair<int,int>, int>> q;
        //BFS 
       q.push({{0,0},1});
       grid[0][0]=1;
       while(!q.empty()){
        int i=q.front().first.first;
        int j=q.front().first.second;
        int dist=q.front().second;
        q.pop();
        if(i==n-1 && j==m-1)return dist;
        //travese on directions 
        for(auto dir:directions){
            int ni=dir.first+i;
            int nj=dir.second+j;
            //check boundry conditions 
            if(ni>=0 && nj>=0 && ni<n && nj<m && grid[ni][nj]==0){
                grid[ni][nj]=1;
                q.push({{ni,nj},dist+1});
            }
        }
       }
   return -1;
    }
};`
    }
  },
  "reverse-linked-list": {
    q: "Reverse Linked List",
    topic: "dsa-linkedlist",
    id: 1,
    source: "leetcode",
    folder: "0206-reverse-linked-list",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0206-reverse-linked-list",
    codes: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
// gfg / leetcode class — method you submit lives here
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev=NULL;
        ListNode* next=NULL;
        ListNode* curr=head;
        // walk until the list ends
        while(curr){
            // save next before we break the link
            next=curr->next;
            // reverse this pointer
            curr->next=prev;
            // this node is now previous
            prev=curr;
            // walk to the saved next
            curr=next;
        }
        // new head is the last prev
        return prev;
    }
};`
    }
  },
  "linked-list-cycle": {
    q: "Linked List Cycle",
    topic: "dsa-linkedlist",
    id: 2,
    source: "leetcode",
    folder: "0141-linked-list-cycle",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0141-linked-list-cycle",
    codes: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
// gfg / leetcode class — method you submit lives here
class Solution {
public:
    bool hasCycle(ListNode *head) {
        // slow starts at head (1 step)
        ListNode* slow=head;
        // fast starts at head (2 steps)
        ListNode* fast=head;
        // keep going while a two-step is safe
        while(fast && fast->next){
            // slow takes one step
            slow=slow->next;
            // fast takes two steps
            fast=fast->next->next;
            // they met — a cycle exists
            if(slow==fast)return true;
        }
        // fast hit the end — no cycle
        return false;
    }
};`
    }
  },
  "linked-list-cycle-ii": {
    q: "Linked List Cycle II",
    topic: "dsa-linkedlist",
    id: 3,
    source: "leetcode",
    folder: "0142-linked-list-cycle-ii",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0142-linked-list-cycle-ii",
    codes: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
// gfg / leetcode class — method you submit lives here
class Solution {
public:
    ListNode *detectCycle(ListNode *head) {
        // slow starts at head (1 step)
        ListNode* slow=head;
        // fast starts at head (2 steps)
        ListNode* fast=head;
        // keep going while a two-step is safe
        while(fast && fast->next){
            // slow takes one step
            slow=slow->next;
            // fast takes two steps
            fast=fast->next->next;
            // same node — loop found
            if(slow==fast){
                // slow starts at head (1 step)
                slow=head;
                // keep going while a two-step is safe
                while(fast!=slow){
                     // slow takes one step
                     slow=slow->next;
                     fast=fast->next;
                }
                // slow sits at the middle
                return slow;
            }
        }
        // answer is ready — leave
        return NULL;
    }
};`
    }
  },
  "remove-nth-node-from-end-of-list": {
    q: "Remove Nth Node From End of List",
    topic: "dsa-linkedlist",
    id: 5,
    source: "leetcode",
    folder: "0019-remove-nth-node-from-end-of-list",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0019-remove-nth-node-from-end-of-list",
    codes: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
// gfg / leetcode class — method you submit lives here
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        // name this value so later lines can use it
        int Totalnode=0;
        ListNode* temp=head;
        while(temp!=NULL){
            Totalnode++;
            temp=temp->next;
        }
        // name this value so later lines can use it
        int delnode=Totalnode-n;
        // only do this when the check is true
        if(delnode==0){
            // answer is ready — leave
            return head->next;
        }
        temp=head;
        // name this value so later lines can use it
        int count=1;
        while(temp!=NULL && count<delnode){
            temp=temp->next;
            count++;
        }
        ListNode* deleteNode=temp->next;
        temp->next=deleteNode->next;
        // answer is ready — leave
        return head;
    }
};`
    }
  },
  "palindrome-linked-list": {
    q: "Palindrome Linked List",
    topic: "dsa-linkedlist",
    id: 6,
    source: "leetcode",
    folder: "0234-palindrome-linked-list",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0234-palindrome-linked-list",
    codes: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
ListNode* reverse(ListNode* head){
    ListNode* prev=NULL;
    ListNode* next=NULL;
    ListNode* curr=head;
    while(curr){
        next=curr->next;
        curr->next=prev;
        prev=curr;
        curr=next;
    }
    return prev;
 }
    bool isPalindrome(ListNode* head) {
        //find middle of LL 
        if(head==NULL || head->next==NULL)return true;
        ListNode* slow=head;
        ListNode* fast=head;
        while(fast->next && fast->next->next){
            slow=slow->next;
            fast=fast->next->next;
        }
        //slow is pointing middle of LL
        ListNode* newHead=reverse(slow->next);
        ListNode* h1=newHead;
        ListNode* h2=head;
        while(h1){
            if(h1->val != h2->val)return false;
            h1=h1->next;
            h2=h2->next;
        }
        return true;
    }
};`
    }
  },
  "middle-of-the-linked-list": {
    q: "Middle of the Linked List",
    topic: "dsa-linkedlist",
    id: 7,
    source: "leetcode",
    folder: "0876-middle-of-the-linked-list",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0876-middle-of-the-linked-list",
    codes: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
// gfg / leetcode class — method you submit lives here
class Solution {
public:
    ListNode* middleNode(ListNode* head) {
        // slow starts at head (1 step)
        ListNode* slow=head;
        // fast starts at head (2 steps)
        ListNode* fast=head;
        // keep going while a two-step is safe
        while(fast&& fast->next){
            // slow takes one step
            slow=slow->next;
            // fast takes two steps
            fast=fast->next->next;
        }
        // slow sits at the middle
        return slow;
    }
};`
    }
  },
  "intersection-of-two-linked-lists": {
    q: "Intersection of Two Linked Lists",
    topic: "dsa-linkedlist",
    id: 8,
    source: "leetcode",
    folder: "0160-intersection-of-two-linked-lists",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0160-intersection-of-two-linked-lists",
    codes: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
// gfg / leetcode class — method you submit lives here
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        ListNode* s1=headA;
        ListNode* s2=headB;
       while(s1 != s2){
        // only do this when the check is true
        if(s1==NULL){
            s1=headB;
        }else{
             s1=s1->next;
        }
       
        // only do this when the check is true
        if(s2==NULL){
            s2=headA;
        }else{
            s2=s2->next;
        }
        
       }
       // answer is ready — leave
       return s1;
    }
};`
    }
  },
  "add-two-numbers": {
    q: "Add Two Numbers",
    topic: "dsa-linkedlist",
    id: 9,
    source: "leetcode",
    folder: "0002-add-two-numbers",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0002-add-two-numbers",
    codes: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
// gfg / leetcode class — method you submit lives here
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode* temp1=l1;
        ListNode* temp2=l2;
        // name this value so later lines can use it
        int carry=0;
        ListNode* dummy=new ListNode(-1);
        ListNode* curr=dummy;
        while(temp1 || temp2 ||carry){
            // drop the window if the sum went negative
            int sum=0;
            // add this number into the running sum
            sum+=carry;
            // only do this when the check is true
            if(temp1){
                // add this number into the running sum
                sum+=temp1->val;
                temp1=temp1->next;
            }
            // only do this when the check is true
            if(temp2){
                // add this number into the running sum
                sum+=temp2->val;
                temp2=temp2->next;
            }
            curr->next=new ListNode(sum%10);
            carry=sum/10;
            curr=curr->next;
        }
        // answer is ready — leave
        return dummy->next;
    }
};`
    }
  },
  "reverse-nodes-in-k-group": {
    q: "Reverse Nodes in k-Group",
    topic: "dsa-linkedlist",
    id: 10,
    source: "leetcode",
    folder: "0025-reverse-nodes-in-k-group",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0025-reverse-nodes-in-k-group",
    codes: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
ListNode* reverse(ListNode* head,int &count,int k){
    ListNode* next=NULL;
    ListNode* curr=head;
    ListNode* prev=NULL;
    while(curr && count<k){
        next=curr->next;
        curr->next=prev;
        prev=curr;
        curr=next;
        count++;
    }
    return prev;
}
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode* temp=head;
        int count=1;
        while(temp && count<k){
            temp=temp->next;
            count++;
        }
        //if count<k
        if (temp == NULL)
         return head;

        ListNode* nextnode=temp->next;
        temp->next=NULL;
        //reverse k nodes 
        int c=0;
       ListNode* node= reverse(head,c,k);
       
       head->next=reverseKGroup(nextnode,k);
      return node;
    }
};`
    }
  },
  "sort-list": {
    q: "Sort List",
    topic: "dsa-linkedlist",
    id: 12,
    source: "leetcode",
    folder: "0148-sort-list",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0148-sort-list",
    codes: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
ListNode* findMid(ListNode* head){
    ListNode* slow=head;
    ListNode* fast=head->next;
    while(fast && fast->next){
            slow=slow->next;
            fast=fast->next->next;
    }
    return slow;
}
ListNode* merge(ListNode* left,ListNode* right){
       if(!left)return right;
        if(!right)return left;
        ListNode* dummy=new ListNode(-1);
        ListNode* tail=dummy;
        while(left && right){
            if(left->val<=right->val){
                tail->next=left;
                left=left->next;
            }else{
                tail->next=right;
                right=right->next;
            }
            tail=tail->next;
        }
        //copy renmaining 
        while(left){
            tail->next=left;
            tail=tail->next;
            left=left->next;
        }
         while(right){
            tail->next=right;
            tail=tail->next;
            right=right->next;
        }
        return dummy->next;
}
    ListNode* sortList(ListNode* head) {
        if(head==NULL || head->next==NULL)return head;
        //Merge Sort 
        ListNode* mid=findMid(head);
        ListNode* nextmid=mid->next;
        //divide into two parts 
        mid->next=NULL;
        //divide both untill single unit 
        ListNode* left= sortList(head);
        ListNode* right= sortList(nextmid);
        //merge both 
        return merge(left,right);
    }
};`
    }
  },
  "odd-even-linked-list": {
    q: "Odd Even Linked List",
    topic: "dsa-linkedlist",
    id: 17,
    source: "leetcode",
    folder: "0328-odd-even-linked-list",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0328-odd-even-linked-list",
    codes: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
// gfg / leetcode class — method you submit lives here
class Solution {
public:
    ListNode* oddEvenList(ListNode* head) {
        // only do this when the check is true
        if(head==NULL || head->next==NULL)return head;
        ListNode* odd=head;
        ListNode* even=head->next;
        ListNode* evenHead=even;
        while(even && even->next){
            odd->next=even->next;
            odd=odd->next;

            even->next=odd->next;
            even=even->next;
        }
        //merge both even and odd 
        odd->next=evenHead;
        // answer is ready — leave
        return head;
    }
};`
    }
  },
  "valid-anagram": {
    q: "Valid Anagram",
    topic: "dsa-strings",
    id: 1,
    source: "leetcode",
    folder: "0242-valid-anagram",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0242-valid-anagram",
    codes: {
      cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        if(s.length()!=t.length())return false;
        unordered_map<char,int>mp;
        //first store each char in map of s 
        for(int i=0;i<s.length();i++){
            mp[s[i]]++;
        }
        //remove char from map storing char of t 
        for(int i=0;i<t.length();i++){
            mp[t[i]]--;
        }
        for(auto val:mp){
            if(val.second!=0)return false;
        }
        return true;
    }
};`
    }
  },
  "longest-substring-without-repeating-characters": {
    q: "Longest Substring Without Repeating Characters",
    topic: "dsa-strings",
    id: 3,
    source: "leetcode",
    folder: "0003-longest-substring-without-repeating-characters",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0003-longest-substring-without-repeating-characters",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char,int>mp;
        // name this value so later lines can use it
        int curr=0;
        // name this value so later lines can use it
        int maxcurr=0;
        // left pointer
        for(int i=0;i<s.length();i++){
            char ch=s[i];
            // only do this when the check is true
            if(mp.find(ch)!=mp.end()){
                curr=max(curr,mp[ch]+1);
            }
            mp[ch]=i;
            maxcurr=max(maxcurr,i-curr + 1);
        }
        // answer is ready — leave
        return maxcurr;
    }
};`
    }
  },
  "valid-parentheses": {
    q: "Valid Parentheses",
    topic: "dsa-strings",
    id: 6,
    source: "leetcode",
    folder: "0020-valid-parentheses",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0020-valid-parentheses",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    bool isValid(string s) {
        // name this value so later lines can use it
        int n=s.length();
        stack<char>st;
        // left pointer
        for(int i=0;i<n;i++){
         // only do this when the check is true
         if(s[i]=='(' || s[i]=='{' || s[i]=='['){
            st.push(s[i]);
         }
         else{
             // only do this when the check is true
             if(!st.empty()){
                 // only do this when the check is true
                 if((st.top()=='(' && s[i]==')') || (st.top()=='{' && s[i]=='}') || (st.top()=='[' && s[i]==']')){
                st.pop();
            }else{
               // fast hit the end — no cycle
               return false;
            }
             }else{
                // fast hit the end — no cycle
                return false;
             }
           
         }
        }
        // answer is ready — leave
        return st.empty() ?true:false;
    }
};`
    }
  },
  "longest-common-prefix": {
    q: "Longest Common Prefix",
    topic: "dsa-strings",
    id: 7,
    source: "leetcode",
    folder: "0014-longest-common-prefix",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0014-longest-common-prefix",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        // name this value so later lines can use it
        string word=strs[0];
        // name this value so later lines can use it
        string ans="";
        // left pointer
        for(int i=0;i<word.size();i++){
            char ch=word[i];
            //find in other words i th char 
            // walk each index
            for(int j=1;j<strs.size();j++){
                // only do this when the check is true
                if(strs[j][i]!=ch){
                    // answer is ready — leave
                    return ans;
                }
            }
            ans+=ch;
        }
        // answer is ready — leave
        return ans;
    }
};`
    }
  },
  "reverse-words-in-a-string": {
    q: "Reverse Words in a String",
    topic: "dsa-strings",
    id: 8,
    source: "leetcode",
    folder: "0151-reverse-words-in-a-string",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0151-reverse-words-in-a-string",
    codes: {
      cpp: `class Solution {
public:
    string reverseWords(string s) {
        vector<string>words;
        for(int i=0;i<s.length();i++){
            //first remove spaces 
            while(s[i]==' '){
                i++;
            }
            string word="";
            while(i<s.length() && s[i]!=' '){
              word+=s[i];
              i++;
            }
            if(!word.empty()){
            words.push_back(word);
            }
            //empty word
            word="";
        }
        //reverse the words vector 
        reverse(words.begin(),words.end());
        string ans="";
        for(int i=0;i<words.size();i++){
            ans+=words[i];
            //add space except last word
            if(i!=words.size()-1){
                ans+=" ";
            }
        }
        return ans;
    }
};`
    }
  },
  "roman-to-integer": {
    q: "Roman to Integer",
    topic: "dsa-strings",
    id: 17,
    source: "leetcode",
    folder: "0013-roman-to-integer",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/0013-roman-to-integer",
    codes: {
      cpp: `// gfg / leetcode class — method you submit lives here
class Solution {
public:
    int romanToInt(string s) {
        unordered_map<char,int>mp{{'I', 1},{'V', 5},{'X', 10},{'L', 50},{'C', 100},{'D', 500},{'M', 1000}};
        // name this value so later lines can use it
        int ans=0;
        // left pointer
        for(int i=0;i<s.length();i++){
            // name this value so later lines can use it
            int first=mp[s[i]];
            // name this value so later lines can use it
            int second=mp[s[i+1]];
            // only do this when the check is true
            if(second>first){
             ans-=first;
            }else{
                ans+=first;
            }
        }
        // answer is ready — leave
        return ans;
    }
};`
    }
  },
  "amount-of-time-for-binary-tree-to-be-infected": {
    q: "Amount of Time for Binary Tree to Be Infected",
    topic: "dsa-tree",
    id: 30,
    source: "leetcode",
    folder: "2385-amount-of-time-for-binary-tree-to-be-infected",
    repo: "https://github.com/RAJA8112008/Leetcode/tree/main/2385-amount-of-time-for-binary-tree-to-be-infected",
    codes: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
TreeNode* findNode(TreeNode* root,int start){
    //base case 
      //root is not presernt 
    if(root==NULL)return NULL;
    if(root->val==start){
        return root;
    }
  
    //now left and right side 
    TreeNode* left= findNode(root->left,start);
    //it may be NULL '
    if(left!=NULL)return left;
    //travese on its right sides
    return findNode(root->right,start);
}
    int amountOfTime(TreeNode* root, int start) {
        //store first parent of each node 
        unordered_map<TreeNode*,TreeNode*>parent;
        //mark root parent -1
        parent[root]=NULL;
        //mark all nodes parent 
        queue<TreeNode*>q;
        q.push(root);
        //while
        while(!q.empty()){
            TreeNode* node=q.front();
            q.pop();
            //check its child first 
            if(node->left){
                q.push(node->left);
                parent[node->left]=node;
            }
            if(node->right){
                q.push(node->right);
                parent[node->right]=node;
            }

        }
        //find node from where have to make infected
        TreeNode* stnode=findNode(root,start);
      //find out node from here have to infr=ect tree 
       //take an visited array to track
       unordered_map<TreeNode*,bool>visited;
      q.push(stnode);
      visited[stnode]=true;
      int time=0;
      //travesre on its all childs and parets
      while(!q.empty()){
        int size=q.size();
        for(int i=0;i<size;i++){
             TreeNode* node=q.front();
             q.pop();
              //childs 
         if(node->left && !visited[node->left]){
            q.push(node->left);
            //mark it visited
            visited[node->left]=true;
         }
         if(node->right && !visited[node->right]){
            q.push(node->right);
            //mark it visited
            visited[node->right]=true;
         }
         //parent 
         if(parent[node] && !visited[parent[node]]){
            q.push(parent[node]);
            visited[parent[node]]=true;
         }
        }
       time++;
      }
     return time-1;

    }
};`
    }
  },
};
