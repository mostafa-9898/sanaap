import axiosInstance from "./axios.config";
import { normalizeListResponse } from "../utils";
import { INSURANCE_COMPANY } from "../constants";

/**
 * جستجوی شعب بیمه
 * @param {string} province - شناسه استان
 * @param {string} name - نام شعبه برای جستجو
 * @param {AbortSignal} signal - سیگنال لغو درخواست
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
export const searchBranches = async (province, name, signal) => {
  const response = await axiosInstance.get("api/v2/app/selection_item/insurance_branch/wop_list/", {
    params: {
      name,
      insurance: INSURANCE_COMPANY,
      province,
    },
    signal,
  });
  return normalizeListResponse(response.data);
};
